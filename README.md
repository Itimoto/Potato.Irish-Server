# Famine.Potato.Irish
An [experimental site](https://famine.potato.irish) housing live projects.

___

<a href="https://famine.potato.irish" target="_blank">
  <img src="https://raw.githubusercontent.com/Itimoto/Potato.Irish-Server/master/public/images/jpg/potato-landing.jpg" 
  alt="Famine.Potato.Irish's Landing Page" />
</a>

> You'll find the full* source running on the remote server.
> Current Projects include the [Roomba Roamer](https://famine.potato.irish/rr) and [Pong](https://famine.potato.irish/pong)

*It's running HTTPS/SPDY, so the SSL Cert files are omitted. Remember -- you can generate your own with [Certbot / Let's Encrypt](https://certbot.eff.org/)!


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


## Credit Where Credit Is Due.
This project would not have been possible without other, external contributions. Though I'm unsure as to whether to cite them as *contributors* or *vendors*, here lie the external libraries used:

- *131's [H264 Live Player](https://github.com/131/h264-live-player)*
- *PimTerry's [H264 Header-Data Capture Script](https://github.com/pimterry/raspivid-stream/blob/master/index.js)*
- *ey3ball's [Leaky Buffer, coupled with neat exploration and explanation of Stream Backpressuring](http://ey3ball.github.io/)*
