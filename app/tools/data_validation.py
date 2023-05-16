import re


def validate_email(email: str) -> bool:
    """
    Validate email address using a regex. Returns True if email is valid, False if not.

    Args:
        email (str): email address to validate

    Returns:
        bool: True if email is valid, False if not
    """
    email_regex = re.compile(r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$')
    return email_regex.match(email)


def validate_username(username: str) -> bool:
    """
    Validate username using a regex. Returns True if username is valid, False if not.

    Args:
        username (str): username to validate

    Returns:
        bool: True if username is valid, False if not
    """
    username_regex = re.compile(r'^[a-zA-Z0-9_.-]+$')
    return username_regex.match(username)


def validate_password(password):
    """
    Validate password using a regex. Returns True if password is valid, False if not.

    Args:
        password (str): password to validate

    Returns:
        bool: True if password is valid, False if not
    """
    password_regex = re.compile(r'^.{8,}$')
    return password_regex.match(password)
