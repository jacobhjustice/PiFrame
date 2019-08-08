# Python is pre-installed
echo "Squaring away all python dependencies..."
python -m pip install --upgrade pip
pip install requirements.txt -R 

# Need to install npm to run our client
echo "Getting node.js ready to use..."
sudo apt-get update
sudo apt-get upgrade
sudo apt-get install nodejs npm
npm update