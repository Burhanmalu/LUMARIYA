from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from authlib.integrations.starlette_client import OAuth
from starlette.requests import Request
import httpx

from app.database import get_db
from app.models.user import User
from app.schemas.user import Token
from app.utils.auth import create_access_token
from app.config import get_settings

settings = get_settings()
router = APIRouter(prefix="/api/auth", tags=["OAuth"])

# Initialize OAuth
oauth = OAuth()

# Register Google OAuth
oauth.register(
    name='google',
    client_id=settings.google_client_id,
    client_secret=settings.google_client_secret,
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

# Register Facebook OAuth
oauth.register(
    name='facebook',
    client_id=settings.facebook_client_id,
    client_secret=settings.facebook_client_secret,
    authorize_url='https://www.facebook.com/v12.0/dialog/oauth',
    access_token_url='https://graph.facebook.com/v12.0/oauth/access_token',
    client_kwargs={'scope': 'email public_profile'}
)


@router.get("/google/login")
async def google_login(request: Request):
    """Initiate Google OAuth login."""
    redirect_uri = f"{settings.frontend_url}/api/auth/google/callback"
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/google/callback")
async def google_callback(request: Request, db: AsyncSession = Depends(get_db)):
    """Handle Google OAuth callback."""
    try:
        # Get token from Google
        token = await oauth.google.authorize_access_token(request)
        
        # Get user info from Google
        user_info = token.get('userinfo')
        if not user_info:
            # Fetch user info if not in token
            async with httpx.AsyncClient() as client:
                resp = await client.get(
                    'https://www.googleapis.com/oauth2/v3/userinfo',
                    headers={'Authorization': f'Bearer {token["access_token"]}'}
                )
                user_info = resp.json()
        
        email = user_info.get('email')
        name = user_info.get('name', email.split('@')[0])
        google_id = user_info.get('sub')
        
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email not provided by Google"
            )
        
        # Check if user exists
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        
        if user:
            # Update OAuth info if user exists
            if not user.oauth_provider:
                user.oauth_provider = 'google'
                user.oauth_id = google_id
                await db.commit()
        else:
            # Create new user
            user = User(
                email=email,
                full_name=name,
                oauth_provider='google',
                oauth_id=google_id
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)
        
        # Generate JWT token
        access_token = create_access_token(data={"sub": user.id})
        
        # Redirect to frontend with token
        return RedirectResponse(
            url=f"{settings.frontend_url}/auth/callback?token={access_token}"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"OAuth authentication failed: {str(e)}"
        )


@router.get("/facebook/login")
async def facebook_login(request: Request):
    """Initiate Facebook OAuth login."""
    redirect_uri = f"{settings.frontend_url}/api/auth/facebook/callback"
    return await oauth.facebook.authorize_redirect(request, redirect_uri)


@router.get("/facebook/callback")
async def facebook_callback(request: Request, db: AsyncSession = Depends(get_db)):
    """Handle Facebook OAuth callback."""
    try:
        # Get token from Facebook
        token = await oauth.facebook.authorize_access_token(request)
        
        # Get user info from Facebook
        async with httpx.AsyncClient() as client:
            resp = await client.get(
                'https://graph.facebook.com/me',
                params={
                    'fields': 'id,name,email',
                    'access_token': token['access_token']
                }
            )
            user_info = resp.json()
        
        email = user_info.get('email')
        name = user_info.get('name', 'Facebook User')
        facebook_id = user_info.get('id')
        
        if not email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email not provided by Facebook"
            )
        
        # Check if user exists
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()
        
        if user:
            # Update OAuth info if user exists
            if not user.oauth_provider:
                user.oauth_provider = 'facebook'
                user.oauth_id = facebook_id
                await db.commit()
        else:
            # Create new user
            user = User(
                email=email,
                full_name=name,
                oauth_provider='facebook',
                oauth_id=facebook_id
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)
        
        # Generate JWT token
        access_token = create_access_token(data={"sub": user.id})
        
        # Redirect to frontend with token
        return RedirectResponse(
            url=f"{settings.frontend_url}/auth/callback?token={access_token}"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"OAuth authentication failed: {str(e)}"
        )
