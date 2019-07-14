# China chess
# v2.0.0
Install :

  First step : install nodejs 10.x.x
  
  
   - Install node on Linux :
    
       + sudo apt install curl
       + curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -
       + sudo apt install nodejs
       
       
   - Install npm on Window :
      + https://nodejs.org/dist/latest-v10.x

  Note : App build with Angular2 , Angular2 run on environment  npm 6.x.x . If npm >6x You should downgrade npm to 6.x.x
  
  Next step : 
  
  
    - Easy install project with command on terminal(on linux) or command line (on window) : 
       + npm install
Run project with command on terminal || conmand line : 

    npm start 

App Play China chess and Reverse China Chess :
  China chess 
    - Algorithm :
    
        + apha beta puring ( chooose depth 1->4 )
        + Monte carlo tree search ( chooose max node 1000 -> 10000) 
        
  Reverse China chess :
  
    - Algorithm :
        + apha beta puring (defalt depth  =  3 )
        
  Reslove state :
    
    - Input state : 
	      
        + input any state, State syntax is a string, chess piece separated by a comma, the end of string is a comma
	      + Example:  k 9 4 -1,k 1 5 1, j1 4 9 -1,j2 1 1 1,s 8 4 -1,

    - Algorithm :
        + apha beta puring (defalt depth  =  4 )
        
  support app :
  
    - undo 
    - redo
    - restart
    - time mode && change time
    - switch team 
    - input state && slove 
    - graph win rate  
    - log move of piece 
   
    
