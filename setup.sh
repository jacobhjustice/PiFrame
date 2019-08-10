# Python is pre-installed
echo "Squaring away all python dependencies..."
python3 -m pip install --upgrade pip
pip3 install -r requirements.txt 

# Need to install npm to run our client
echo "Getting node.js ready to use..."
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install nodejs npm
npm update
cd app
npm install

# Set browser on load/run on load
cd ..
echo "Finished running set up. To start PiFrame, run ./run.sh"
