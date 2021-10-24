# argo-circolari

A tool to easily download all the circulars of the current year from ARGO electronic register.

## Requirements

- [Node](https://nodejs.org/it/) >= 14.0
- [Argo electronic register](https://argofamiglia.it)

## Installation

1. Download the source code from [here](https://github.com/lorenzocorallo/argo-famiglia/archive/refs/heads/main.zip) or click the above green button `Code` and click `Download Zip`
2. Extract the zip file in a new folder and open it
3. Open the folder in a terminal
   1. If you are on Windows 11, just right click and press `Open with Windows Terminal`
   2. If you are on Windows 10, hold `shift` on your keyboard and right click on a white space, then press `Open command window here`
4. Type in the terminal:
   ```shell
   npm i
   ```

## How to use

1. Open the folder in a terminal (as described above) and run the script with node typing:

   ```shell
   node .
   ```

2. Insert your username and press enter.
3. Insert your password and press enter. The input is hidden for security reason, so don't worry if you don't see what are you writing
4. Insert your school code and press enter.
5. If no error appears, processing will start and the circulars will be downloaded one by one.  
   This process can take a lot of time depending on the number of circulars, the speed of your machine and your network.
6. Wait for the files to be saved and you are done!

## Issues

Before reporting any issue, check your credentials on [Argo website](https://www.portaleargo.it/argoweb/famiglia/)

## Disclaimer

Remember that you are responsible for what you are doing on the internet and even tho this script exists, the purpose of using it may not be legal.

## License

This software uses the MIT License
