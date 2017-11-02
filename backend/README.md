To run server successfully, you have to install graphicsmagick, imagemagick and ffmpeg firstly. 

In Mac OS X, run 
`brew install graphicsmagick`
`brew install ffmpeg --with-faac --with-freetype`

In Ubuntu, run

```
sudo add-apt-repository ppa:kirillshkrogalev/ffmpeg-next
sudo apt-get update
sudo apt-get install ffmpeg --with-faac
```

Also run install_ffmpeg_ubuntu.sh script that's included in renderer.

You have to create uploads folder in here.

Also to run instagram_server, you need to create downloads folder within instagram_server folder and install curl. 

You also need to install php5-gd to run image converter.

```
sudo apt-get install php5-gd
```

To run instagram server forever, do this.

```
nohup sh run_server.sh &
```