# Simple specification render application 

Node JS Express web application.
Allows to render a list of links to the specifications in the private repos and redirects to swagger UI installation. 

## Deployment

### Local installation

To loop the application (will restart after any crash):
`forever --minUptime 100 start bin/www`

To loop in non-daemon mode (useful for debug):
`forever --minUptime 100 bin/www`

The port can be set with PORT variable, the default port is 3000:
`export PORT=3050`
`forever ...`

### Docker-based installation

if you have docker-compose (`pip install docker-compose`) you can use it:

`docker-compose up` or `docker-compose up -d` for detached (daemon) mode.

This will listen 3031 port, check docker-compose.yml for details about the port.
