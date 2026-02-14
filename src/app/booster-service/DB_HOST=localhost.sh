DB_HOST=localhost
# Database Name
DB_DATABASE=u193446821_workagnt
# Database Username
DB_USERNAME=u193446821_workagnt
# Database Password
DB_PASSWORD=6TmYmCiHh~
# Mail Configuration
MAIL_MAILER=sendmail
MAIL_HOST=smtp.hostinger.com


mysqldump -u u193446821_workagnt -p u193446821_workagnt > backup12-2-26.sql
mariadb-dump -u u193446821_workagnt -p u193446821_workagnt > mariabackup12-2-26.sql




APP_URL=https://tronex.ai/
APP_NAME="WABA PANEL"
# Use 'production' for live uses
APP_ENV=development
# Set to true for debugging
APP_DEBUG=true
# application key
APP_KEY=base64:/6cAnbpThXWkN5OIJUaThlpSjpwrZQcvJFNyLlKGRiY=
# Database Host
DB_HOST=localhost
# Database Name
DB_DATABASE=u193446821_workagnt
# Database Username
DB_USERNAME=u193446821_workagnt
# Database Password
DB_PASSWORD=6TmYmCiHh~
# Mail Configuration
MAIL_MAILER=sendmail
MAIL_HOST=smtp.hostinger.com
MAIL_PORT=465
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
MAIL_FROM_ADDRESS=null
MAIL_FROM_NAME="${APP_NAME}"


# SSO Secret - Shared secret for JWT token verification
SSO_SECRET=saskae

# Module API Secret - Token for CRM to authenticate API requests
MODULE_API_SECRET=saskae