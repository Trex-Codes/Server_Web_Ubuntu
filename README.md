# Flask Web Server on Ubuntu Server 20.04 LTS 🚀

The web server was set up using technologies like Nginx, Flask, and uWSGI. All of this process was completed on Ubuntu Server 20.04 LTS.

### Table of Contents
* [Install 🔧](#install)
* [Usage ✔️](#usage)
* [Structure 🏗️](#structure)


# Install 🔧

* Download the ISO for Ubuntu Server from the official website at [Ubuntu](https://ubuntu.com/download/server).

* We used [VirtualBox](https://www.virtualbox.org/wiki/Downloads) to create the simulation, but you can download and install it as needed.
* Once all the required programs are installed on your computer, proceed with the next step.
* Configure the ISO and, in the final step, set your network interface to "Bridge adapter" to make the VM act like a PC on your LAN.
* Complete the installation and configuration of the Ubuntu Server VM and verify that everything is working correctly.
* As a server, we will set a static IP address. We will see how to do that at the end.

### *Install Nginx and Python Dependencies*

```
sudo apt update && apt install nginx -y

# Next, install the required Python dependencies to create and run your Flask application:
sudo apt install -y python3 python3-venv python3-pip
```

### *Creating the Flask Project*

* First, create a directory for your project and navigate into it:

```
mkdir -p ~/miweb && cd ~/miweb
```

Then, create and activate a Python virtual environment:

```
python3 -m venv venv
source venv/bin/activate
```

Next, install Flask (the web framework) and uWSGI (the service for running Flask with Nginx):

```
pip install flask uwsgi
```

### Creating the Flask Application

* Create a new Python file for your Flask application app.py:

```
nano ~/miweb/app.py
```

```
from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
```

### Creating the Templates Folder and HTML Files

* First, create the necessary directories for your project:

```
mkdir -p ~/myweb/templates
mkdir -p ~/myweb/static/css
mkdir -p ~/myweb/static/js
mkdir -p ~/myweb/static/img
```

* Then, create the routes for `styles.css - script.js` file for your web:

```
nano ~/miweb/static/css/style.css
nano ~/miweb/static/js/script.js
```

### Creating the wsgi.py File

```
nano /home/trexcodes/myweb/wsgi.py
```

```
from app import app

if __name__ == "__main__":
    app.run()
```

The `wsgi.py` file is used by uWSGI to serve your Flask application in production, and it's necessary for the proper deployment setup.

### Configuring Systemd to Start uWSGI

* First, create a new systemd service file for your application (myweb.service):

```
sudo nano /etc/systemd/system/miweb.service
```

```
[Unit]
Description=uWSGI server for myweb
After=network.target

[Service]
User=trexcodes
Group=www-data
WorkingDirectory=/home/trexcodes/myweb
Environment="PATH=/home/trexcodes/myweb/venv/bin"
ExecStart=/home/trexcodes/myweb/venv/bin/uwsgi --ini uwsgi.ini

[Install]
WantedBy=multi-user.target

```

To enable and start the service:

```
sudo systemctl enable myweb.service
sudo systemctl start myweb.service
```

![Services](https://github.com/Trex-Codes/Server_Web_Ubuntu/blob/master/source/services.PNG?raw=true)


### Configuring Nginx (Reverse Proxy)

* create a new Nginx configuration file for your application

```
sudo nano /etc/nginx/sites-available/miweb
```

```
server {
    listen 80;
    server_name 192.168.1.14;  # Change this to your server's IP address

    location / {
        include uwsgi_params;
        uwsgi_pass unix:/home/trexcodes/myweb/myweb.sock;
    }
}

```

After creating the configuration file, create a symbolic link to enable it:

```
sudo ln -s /etc/nginx/sites-available/myweb /etc/nginx/sites-enabled/
sudo nginx -t  # Verifies if there are errors in the configuration
sudo systemctl restart nginx
```

This will set up Nginx as a reverse proxy to forward requests to the uWSGI server running your Flask application.

### Editing and Configuring uwsgi.ini

* Then, add the following configuration to the `uwsgi.ini` file:

```
nano /home/trexcodes/miweb/uwsgi.ini
```

```
[uwsgi]
module = wsgi:app
master = true
processes = 4
socket = /home/trexcodes/myweb/myweb.sock
chmod-socket = 660
vacuum = true
die-on-term = true
```

```
sudo systemctl daemon-reload
```

Once you've edited and saved the file, uWSGI will use this configuration when it starts.

# Usage  ✔️

* Once the `miweb.service` file is configured, reload the systemd manager to recognize the new service:
  * Start the `miweb` service
  * Enable the service to start automatically on boot
  * Check the status of the `miweb` service to ensure it's running correctly

```
sudo systemctl start miweb
sudo systemctl enable miweb
sudo systemctl status miweb
```

* ❗❗ If you make any changes or edits to the configuration files, you need to restart both Nginx and the uWSGI service to apply the new parameters. Use the following commands ❗❗

```
sudo systemctl restart nginx
sudo systemctl restart miweb
```

# Result
![Website deployment on IP address](https://github.com/Trex-Codes/Server_Web_Ubuntu/blob/master/source/website.PNG?raw=true)



# Structure 🏗️

The project is organized as follows:

📂 /home/trexcodes/miweb  
│── 📜 app.py              # Main Flask application code  
│── 📜 wsgi.py             # uWSGI entry point  
│── 📜 uwsgi.ini           # uWSGI configuration  
│── 📂 venv/               # Python virtual environment  
│   ├── 📂 bin/            # Executables of the virtual environment  
│   ├── 📂 lib/            # Python libraries  
│   ├── 📂 include/        # Header files  
│── 📂 templates/          # HTML files  
│   ├── 📜 index.html      # Main page  
│── 📂 static/             # Static files  
│   ├── 📂 css/            # CSS styles  
│   │   ├── 📜 style.css   # Styles file  
│   ├── 📂 js/             # JavaScript files  
│   │   ├── 📜 script.js   # Script file  
│   ├── 📂 img/            # Site images  
│   │   ├── 📜 logo.png    # Example image  
│── 📂 logs/               # Log folder (optional)  
│   ├── 📜 uwsgi.log       # uWSGI logs  
│   ├── 📜 nginx.log       # Nginx logs  
│  
📂 /etc/nginx/sites-available/  
│── 📜 miweb               # Nginx configuration for the site  
📂 /etc/nginx/sites-enabled/  
│── 📜 miweb               # Symbolic link to the Nginx configuration  
📂 /etc/systemd/system/  
│── 📜 miweb.service       # Systemd service for uWSGI  



- **`app.py`**: Contains the main Flask application logic.
- **`wsgi.py`**: The entry point for uWSGI.
- **`uwsgi.ini`**: uWSGI configuration file.
- **`venv/`**: Python virtual environment for isolated dependencies.
- **`templates/`**: Directory for HTML templates.
- **`static/`**: Directory for static assets like CSS, JavaScript, and images.
- **`logs/`**: Folder for log files (optional).
- **`/etc/nginx/sites-available/`**: Contains Nginx configuration for the site.
- **`/etc/nginx/sites-enabled/`**: Symbolic link for the Nginx configuration.
- **`/etc/systemd/system/`**: Contains the systemd service configuration for uWSGI.

![Structure General](https://github.com/Trex-Codes/Server_Web_Ubuntu/blob/master/source/picture1.PNG?raw=true)


