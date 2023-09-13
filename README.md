# To Start application make sure we have node version less than 16
# Below are the steps to install node version v16.20.2

# For mac system follow below command

# Run
```bash

1.  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" 

2. brew update  

3. brew install nvm

4. mkdir ~/.nvm

5. vim ~/.bash_profile 

6. #Add the below lines to ~/.bash_profile ( or ~/.zshrc for macOS Catalina or newer versions)

export NVM_DIR="$HOME/.nvm"
[ -s "/usr/local/opt/nvm/nvm.sh" ] && \. "/usr/local/opt/nvm/nvm.sh"
[ -s "/usr/local/opt/nvm/etc/bash_completion" ] && \. "/usr/local/opt/nvm/etc/bash_completion"

#Press ESC + :wq to save and close your file.

7. source ~/.bash_profile   
# or 
    source ~/.zshrc 

#based on profile (e.g., ~/.bash_profile or ~/.zshrc)

8. nvm -v
# check nvm version install or not 

9. nvm install v16.20.2

10. nvm use v16.20.2

11. node -v
# check node version


# to install nvm on mac OS
Reference - https://tecadmin.net/install-nvm-macos-with-homebrew/
```

# frontend setup

# To start Frontend Run following command-

```bash
# Go the folder frontend

1. cd frontend

2. node -v
# check node version if its not v16.20.2 then run below command-

nvm use v16.20.2

3. npm install

4. npm start

```

# Backend setup Run following command

```bash
# on root folder of project (videochattut)

1. npm install

2. npm start

``` 