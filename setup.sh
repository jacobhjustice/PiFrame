echo "Pulling latest changes..."
git pull origin master

# Python is pre-installed
echo "Squaring away all python dependencies..."
python3 -m pip install --upgrade pip
sudo pip3 install -r requirements.txt 

# Need to install npm to run our client
echo "Setting up node for usage"
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install nodejs npm
npm update
sudo npm install -g serve

echo "Building react app"
cd /home/pi/PiFrame/app
npm run build

# Set browser on load/run on load
cd ..
echo "Finished running set up. To start PiFrame, run ./run.sh"

# self updating chron job?