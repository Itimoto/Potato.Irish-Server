# Famine.Potato.Irish
An [experimental site](https://famine.potato.irish) housing live projects.

___

<a href="https://famine.potato.irish" target="_blank">
  <img src="https://raw.githubusercontent.com/Itimoto/Potato.Irish-Server/master/public/images/jpg/potato-landing.jpg" 
  alt="Famine.Potato.Irish's Landing Page" />
</a>

> You'll find the full* source running on the remote server.
> Current Projects include the [Roomba Roamer](https://github.com/Itimoto/Roomba-Roamer) and [Pong](https://github.com/Itimoto/Pong)

*It's running HTTPS/SPDY, so the SSL Cert files are omitted. Remember -- you can generate your own with [Certbot / Let's Encrypt](https://certbot.eff.org/)!

---
## Neat. Time to get it Up-And-Running. How?
Grab your favorite Terminal/Console, install Node.JS/NPM, then
clone into this Repository from the location of your choice.
```
git clone https://github.com/Itimoto/Potato.Irish-Server
```
Install the Dependencies. First, on the backend...
```
cd Potato.Irish-Server
npm install
```
...Then, for the H264 Player.
```
cd vendor
npm install
```
Now, you've got to install your SSL certificates. Improper (or *absent*) SSL installations may result in... unfavorable results. Browsers won't allow the WebSocket connection necessary to run the Projects on the server.
There're plenty of options for Certificates: 

- You *could* purchase an SSL Certificate from a Certificate Authority (CA). 
- You could *also* generate a free Certificate with [Certbot](https://certbot.eff.org), which'll allow you to run it on the Net with relatively-little hassle. 
- Or, you could generate a Self-Signed Certificate with [OpenSSL](https://helpcenter.gsx.com/hc/en-us/articles/115015960428-How-to-Generate-a-Self-Signed-Certificate-and-Private-Key-using-OpenSSL) -- the only downside being that viewers will get a Big, Scary 'The Validity of This Site Could Not Be Verified' Warning.

*The choice is yours*

Afterwards, move your `cert.pem`, `chain.pem`, and `privkey.pem` over into the `ssl` folder.

Finally, run the magic words:
```
node server.js
```
And you're golden!

---
## But what about '\_pi-specific'?
That's for the Roomba Roamer. There will be more information available on the Project Page soon, but if you'd like to stream Video, here're some basic instructions:

First, you'll need a Raspberry Pi (of *course*) with Internet Access, Node.JS installed, and a *Camera Module*.

Navigate over to your Pi's terminal (via SSH or... whichever you prefer.). Then, go ahead and copy over the \_pi-specific file:
```
wget https://raw.githubusercontent.com/Itimoto/Potato.Irish-Server/master/_pi-specific/roomba-pi.js
mkdir lib
cd lib
wget https://raw.githubusercontent.com/Itimoto/Potato.Irish-Server/master/_pi-specific/lib/leakyBuffer.js
wget https://raw.githubusercontent.com/Itimoto/Potato.Irish-Server/master/_pi-specific/lib/roomba-opcodes.js
```
*(Yes, there are better methods of downloading. Submodules are an option. However, I screwed up this repository along the way.*

Navigate back to `roomba-pi.js`, then:
```
npm install
```
Finally, say the magic words once more:
```
node roomba-pi.js
```
And you're silver.

---
## Hol' Up: What if You Screwed Up Along The Way And Needed to Reset Potato.Irish From Scratch?
*Well then*, you'd be right where I just was after *accidentally publishing my SSL Credidentials*. Suffice it to say that I made a few mistakes, and hope not to make them again. If I do, or *you do*, or *whatever else*, here's how to build Potato.Irish up *from scratch on __CentOS 6.7__* working with *Dynadot* (as of July 2020):

### 1. __Get your Domain Set Up.__
  - Buy your domain.
    - `potato.irish`
  - Buy some VPS hosting for *root access to the system*, then pick an OS.
    - I picked out CentOS 6.7, as stated.
    - Take note of your VPS's IP in your confirmation email.
    - `IP: ABC.DE.FG.HI`
  - Route your Domain Traffic to your VPS
    - (i.e. Your Domain, hosted (in this example) on Dynadot's Nameservers, needs to redirect Traffic to your 'Virtual Private Server', on which the Website's hosted) (i.e. You have a name, but you don't have a body. It's time to link them up.)
    - Login on Dynadot. Go to *My Domains >> Manage Domains* and select the Tickbox next to your Domain
    - Hit *Bulk Action >> DNS Settings*
    - Replace `Dynadot Parking` with `Dynadot DNS`
    - Now, under 'Domain Record (required)', setup your 'A' record.
    - Remember that 'IP Address' from before? Put it in here.
      - `Record Type: A | IP Address: ABC.DE.FG.HI`
    - If you're like me and wanna mess around with the subdomains, repeat it for the 'Subdomain Records'
      - `Subdomain: famine | Record Type: A | IP Address: ABC.DE.FG.HI`
    - Hit 'Save DNS'
### 2. __Set up your VPS.__
  - SSH into your VPS with the credidentials provided in your confirmation email.
    - `ssh root@potato.irish`
  - [Create a Second User with Sudoer privileges.](https://phoenixnap.com/kb/how-to-create-add-sudo-user-centos)
    - Doing *everything* as root is... a bit risky.
      - `adduser your-name-here`
      - `passwd your-name-here`, then input your new password
    - Now, you'll need to check if the sudoers/wheel group is enabled on your system. It wasn't for me, so:
      - `vi /etc/sudoers`
        - (If you're uncomfortable with `vi` as a text editor, you can *always* install `nano` with `yum install nano`, then replace `vi` with `nano`)
    - Make sure the file [contains the following line](https://developers.redhat.com/blog/2018/08/15/how-to-enable-sudo-on-rhel/)
      - `%wheel ALL=(ALL) ALL`
    - If there's a `#` in front of it, it's *commented out*. Sudoers won't be able to sudo. Remove the `#` to enable it.
    - Now, you'll want to add the user to the Wheel group:
      - `usermod -aG wheel your-name-here`
    - Switch to the New User and Verify the Privileges:
      - `su - your-name-here`
      - `sudo ls -la /root`
    - If everything's going smoothly, move along!
  - [Install NodeJS and NPM](https://linuxize.com/post/how-to-install-node-js-on-centos-7/)
    - "Add the NodeSource yum repository"
      - 'NodeJS' isn't (as far as I can tell) part of the inbuilt YUM repositories. (Your server doesn't know where to download it)
      - `curl -sL https://rpm.nodesource.com/setup_10.x | sudo bash -`
    - "Install Node.js and NPM"
      - `sudo yum install nodejs`
    - Verify the Installation
      - `node --version` => `v10.19.0`
      - `npm --version`  => `6.13.4`
  - [Install Git](https://www.digitalocean.com/community/tutorials/how-to-install-git-on-centos-7)
    - Install it through yum
      - `sudo yum install git`
    - Verify the Installation
      - `git --version` => `git version 1.7.1`
    - (NOTE: If `git clone` throws a `error: while accessing https://${your-git-username-here}@github.com/${your-repo-here} ... fatal: HTTP request failed`, [try this out](https://stackoverflow.com/questions/53625669/git-pull-info-refs-http-request-failed))
      - `sudo yum update -y nss curl libcurl`
  - [Setup Your Firewalls](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-basic-iptables-firewall-on-centos-6)
    - By default, Dynadot's VPS's have a Firewall on most ports -- including ports *80* (HTTP traffic) and *443* (HTTPS traffic). Because of that, any websites you'd want to run on it won't be accessible to the outside world.
    - A quick 'fix' would be to *completely disable the iptables*. Of course, don't do that. That's risky. Don't. Just Don—
      - `sudo service iptables stop` (don't do this)
      - I'm not responsible for any damages you may incur.
    - Instead, set up your Iptables properly. We're going to want to allow SSH (port 22) and Web Traffic (port 80 - HTTP, port 443 - HTTPS)
    - I'd recommend a gander through the [linked guide](https://www.digitalocean.com/community/tutorials/how-to-set-up-a-basic-iptables-firewall-on-centos-6) for a more cohesive grasp of Iptable Rules, but if you just want to get up and running, open up Web Traffic only:
      - `sudo iptables -A INPUT -p tcp -m tcp --dport 80 -j ACCEPT`
      - `sudo iptables -A INPUT -p tcp -m tcp --dport 443 -j ACCEPT`
  - [Register for an SSL Certificate](https://certbot.eff.org/lets-encrypt/centos6-other.html)
    - As stated far above, you've got plenty of choices. I used [Let's Encrypt with Certbot](https://certbot.eff.org/lets-encrypt/centos6-other.html)
    - Install Certbot:
      - `sudo yum install wget`
      - `sudo mv certbot-auto /usr/local/bin/certbot-auto`
      - `sudo chown root /usr/local/bin/certbot-auto`
      - `sudo chmod 0755 /usr/local/bin/certbot-auto`
    - Run Certbot:
      - `sudo /usr/local/bin/certbot-auto certonly --standalone`
    - Follow the instructions. We won't get into Wildcard Certificates -- just do a single domain/subdomain for now:
      - `"Please enter in your domain name(s) (comma and/or space separated)  (Enter 'c'to cancel):" famine.potato.irish`
    - Nice.
### 3. __Implement the Live Repository__
  - Go to the Directory of your Choice
    - `cd ~` 
  - Clone the Repository
    - `git clone https://github.com/Itimoto/Famine.Potato-Server`
  - Install the Dependecies
    - `cd Famine.Potato-Server`
    - `npm install`
    - Then, for the h264 Player:
    - `cd vendor`
    - `npm install`
  - Integrate your SSL Certificates
    - Move to your SSL Directory
      - `cd ../ssl`
    - Two Options:
    - 1) Copy*
      - `sudo cp /etc/letsencrypt/live/famine.potato.irish/cert.pem cert.pem`
      - `sudo cp /etc/letsencrypt/live/famine.potato.irish/privkey.pem privkey.pem`
      - `sudo cp /etc/letsencrypt/live/famine.potato.irish/chain.pem chain.pem`
    - or, 2) Set up a Simlink to the Original Files*
      - `sudo ln -s /etc/letsencrypt/live/famine.potato.irish/cert.pem cert.pem`
      - `sudo ln -s /etc/letsencrypt/live/famine.potato.irish/privkey.pem privkey.pem`
      - `sudo ln -s /etc/letsencrypt/live/famine.potato.irish/chain.pem chain.pem`
    - *Remember: /etc/letsencrypt/live/your-registered-domain-here/cert.pem or privkey.pem, etc.
### 4. __Start the Server__
  - `sudo node server.js`
    - And you're bronze.
### 4.5. __OR: Run the Server in the Background__
  - You'll need a 'Supervisor' which'll run your Node.js apps in the background. Here, we'll use PM2.
  - [We'll install it with NPM](https://www.tecmint.com/install-pm2-to-run-nodejs-apps-on-linux-server/):
    - `sudo npm i -g pm2`
  - Once you've got it, navigate to your Server directory and start the server with:
    - `sudo pm2 start server.js`
  - You can monitor your Console output with:
    - `sudo pm2 monit` or `sudo pm2 monit 0`, if `server.js` is the only active process

---
### __I'm having a few issues. How'd you deal with 'em?__
#### Running `git clone` throws an error
This one?
```
error: while accessing https://${your-git-username-here}@github.com/${your-repo-here}
fatal: HTTP request failed`
```
[Try this out:](https://stackoverflow.com/questions/53625669/git-pull-info-refs-http-request-failed)
```
sudo yum update -y nss curl libcurl
```

#### Running `git push` throws an error
This one?
```
error: The requested URL returned error: 403 Forbidden while accessing https://github.com/Itimoto/Potato.Irish-Server/info/refs

fatal: HTTP request failed
```
[Check your git config:](https://www.a2hosting.com/kb/developer-corner/version-control-systems1/403-forbidden-error-message-when-you-try-to-push-to-a-github-repository)
```
git config -l | grep url
```
If it outputs something along the lines of:
> `remote.origin.url=https://github.com/github-username/github-repository-name.git`
...["You'll need to add your GitHub username to the *github.com* portion of the URL:"](remote.origin.url=https://github.com/github-username/github-repository-name.git)
```
git remote set-url origin "https://github-username@github.com/github-username/github-repository-name.git"
```


#### Trying to run `/certbot-auto` throws an error
This one?
```
...
URLError: <urlopen error [SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed (_ssl.c:852)>
```
Well, I could never *really* figure out how to fix it -- it seems to be an OS-related issue. Rather, reinstalling CentOS 6.7 seemed to fix it.

The only issue being, however, needing to reintegrate the Server *one more time all over again*

(If it's any help, checking the CentOS version (with `cat /etc/centos-release`, if I remember correctly) returned `CentOS 6.10 (Final)` instead of `CentOS 6.7 (Final)`)

---
## Commentary

Truthfully, the site wasn't exactly... meant to be much more than the Potato Launcher -- y'know, with `Pongtato`, `Robotato`, `???tato`, etc. But it came to solve a couple of long-standing goals of mine: 
1) To design a full, responsive website, 
2) To feature a portfolio, and 
3) To have an outlet for my projects. Almost a blog, really.

#### Challenges
I didn't know much HTML. Or CSS. Or browser-based Javascript. Boy, was *that* a major hurdle. On top of that, utilizing 'mobile-first' philosophies -- with smaller images, smaller loading times, and attempts to keep the site as speedy as possible -- played the most significant role.

The same thing goes for the 'Articles' page, which is my first 'web scraper'. But not quite. Sort-of.

But I did build the site from scratch, unlike prior tries. Sure, there *was* some script-kiddie-ing involved, but only for learning purposes.

---
## Credit Where Credit Is Due.
This project would not have been possible without other, external contributions. Though I'm unsure as to whether to cite them as *contributors* or *vendors*, here lie the external libraries used:

- __[@131's](https://github.com/131)__ [H264 Live Player](https://github.com/131/h264-live-player)
- __[@PimTerry's](https://github.com/pimterry)__ [H264 Header-Data Capture Script](https://github.com/pimterry/raspivid-stream/blob/master/index.js)
- __[@ey3ball's](https://github.com/ey3ball)__ [Leaky Buffer, coupled with neat exploration and explanation of Stream Backpressuring](http://ey3ball.github.io/)
- And the remaining *remarkably helpful* tutorials linked to when applicable.
