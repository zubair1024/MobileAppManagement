# Mobile App Management Portal (247HomeRescue)

[![company](https://img.shields.io/badge/company-razrlab-brightred.svg)](http://razrlab.com)
[![author](https://img.shields.io/badge/author-zubair1024-lightgrey.svg)](https://github.com/zubair1024)
[![stable](https://img.shields.io/badge/stability-unstable-darkred.svg)]()

![alt text](./me.gif "Mobile App Management")

#### Installing MobileAppManagement:

###### The following steps will do in the installation of a new deployment on DigitalOcean:

1. Create keymetric bucket and add the appropriate key on the root files.
1. Create mongodb db and place the appropriate connection string on the ```db\db.js``` file.
1. Get a Node installed Droplet or install a new version of nodejs.
1. Clone the git repository, through the following command:

```git clone https://github.com/zubair1024/MobileAppManagement.git```

1. Install application dependencies (local and global):

```npm install```

1. Allow remote ports to be accessible (refer to all ports on config.js file). It can be done through the following command:

```sudo ufw allow 5000```
	alternatively
``` sudo ufw allow 5000/tcp ```
1. Start the application using the following commands:

```npm start```

1. Monitor the logs via pm2:

```pm2 logs```

1. Use frontail for remote log monitoring:

```frontail /root/.pm2/logs/com-out-1.log -d -p 9001 -t dark && frontail /root/.pm2/logs/web-out-1.log -d -p 9002 -t dark && frontail /root/.pm2/logs/etl-out-1.log -d -p 9003 -t dark```