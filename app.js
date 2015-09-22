(function(htmlfile){
var
	board = null,
	currentPlayer = 'red', //versus 'yellow'
	get = function(id){
        return htmlfile.getElementById(id);
    },
    cell = function(row,col){
    	return get('cell'+row+'-'+col);
    },
    switchPlayer = function(){
    	get('cap').className = currentPlayer;
    	switch(currentPlayer){
    		case 'red':{
    			currentPlayer = 'yellow';
    			break;
    		}
    		default: currentPlayer ='red'
    	}
    	get('cap').className = currentPlayer;
    	get('cap').innerHTML = '(current turn by: '+currentPlayer+')';

    },
    begin = function(){
    	currentPlayer='red';
    	get('cap').innerHTML='(now playing: '+currentPlayer+')';
		get('cap').className = currentPlayer;
    	prepareBoard();
    	updateBoardView();
    },
    prepareBoard = function(){
    	board = new Array(6);
    	for (var row=0; row < board.length;row++)
    		board[row]=new Array(7);

    	for (var row=0; row < board.length;row++)
    		for (var col=0;col < board[row].length;col++)
    			//board[row][col]= row + '' + col; //testing only
    			board[row][col] = ''; //use this instead
    },
    updateBoardView = function(){
    	var cellsHTML;
    	cellsHTML = '';
    	for (var row=0;row < board.length;row++){
    		cellsHTML += '<tr>';
    		for (var col=0;col < board[row].length;col++){
    			//cellsHTML += '<td class="'+board[row][col]+'" id="cell'+row+'-'+col+'"><a>'+board[row][col]+'<br>'+row+'-'+col+'</a></td>';
    			cellsHTML += '<td class="'+board[row][col]+'" id="cell'+row+'-'+col+'" tooltip="'+row+'-'+col+'"></td>';
    		}
    		cellsHTML += '</tr>';
    	}
    	get('boardCells').innerHTML = cellsHTML;
    	bindClicktoCell();
    	//alert(get('boardCells').innerHTMl);
    },
    bindClicktoCell = function(){ //we parse the "table" backwards from right to left
    	//alert('binding...');
    	var row=board.length-1;
    	var col=board[row].length-1;
    	var lastRowClickable=0;
		for (col=board[row].length-1;col >= 0;col--){
			for (lastRowClickable=board.length-1;lastRowClickable>0;lastRowClickable--){
				 if(board[lastRowClickable][col].length == 0) 
				 	break;}

			for (row=board.length-1; row >= 0;row--){
				if(board[row][col].length > 0){
					continue;
				}else{
					//cell(row,col).onclick=null;
					cell(row,col).onclick = function(row,col,lastRowClickable){
						return function(){   //we need to force early binding para di mawala si row,col
							//alert('clicked '+row+':'+col +' with value: '+board[row][col]);
							board[lastRowClickable][col]=currentPlayer;
							//alert(board[row][col]);
							updateBoardView();
							//cell(lastRowClickable,col).onclick=null;
							if (winnerFound(lastRowClickable,col)){
								get('cap').innerHTML='(winner!)';
								alert(currentPlayer + ' wins!');
								begin();
							} else switchPlayer();
						}
					}(row,col,lastRowClickable)
					//break;
				}
			}
		}
    },
    winnerFound = function(row,col){
    	return (isVerticalConnect(row,col)||isHorizontalConnect(row,col)||isDiagonalNWxSEConnect(row,col)||isDiagonalNExSWConnect(row,col));
    	//return (isVerticalConnect(row,col));
    	//return (isHorizontalConnect(row,col));
    	//return (isDiagonalNWxSEConnect(row,col));
    	//return (isDiagonalNExSWConnect(row,col));

    },
    isVerticalConnect = function(row,col){
		var colorCount=0;
    	//check vertical

    	for (var x=board.length-1;x>0;x--){
    		if (board[x][col] === currentPlayer)
    			colorCount++;
    		else if (board[x][col] != currentPlayer)
					colorCount = 0;
			if (colorCount>3 || board[x][col]=='') break;
    		//alert('color:'+colorCount+'___i:'+i);
    	}
    	return (colorCount>3);
    },
    isHorizontalConnect = function(row,col){
	   	var left=0,right=0,colorCount=0;

    	//check horizontal
    	for(left=col-1;left>0;left--)
    		if(board[row][left]!=currentPlayer) break;

		for(right=col;right<board.length;right++)
    		if(board[row][right]!=currentPlayer) break;
    	//alert(left+' '+right);
		colorCount=right-left;
		return (colorCount>4);
    },
    isDiagonalNWxSEConnect = function(row,col){
    	//check NW x SE or \
    	//get lowest row col where we can start to loop
    	var colorCount=0;
    	var x=0,y=0;
    	if (row > col) 
    		x = row-col;
    	else y = col-row;

    	for (;x<6;x++){
    		if (board[x][y] === currentPlayer)
    			colorCount ++;
    		else if (board[x][y] != currentPlayer)
					colorCount = 0;
			//alert('color:'+colorCount+'  ___xy:'+row+','+i);
			if (colorCount>3 || board[x][y]==null) break;
			y++;
    	}
    	return (colorCount>3);
    },
    isDiagonalNExSWConnect = function(row,col){
    	//check SW x NE or /
    	var colorCount=0;
    	var x=0,y=0;

    	if( (row+col)<board.length){ //possiblebord[row].lngth?
    		x=row+col;
    		y=0;
    	} else {
    		for (x=row,y=col;x<board.length-1;x++,y--);
    	}
		
    	//alert(board.length);
		if( (row+col)<board.length){
			for(;x>=0;y++,x--){
				//alert('color:'+colorCount+'  ___xy:'+x+','+y);
				if (board[x][y] === currentPlayer)
    				colorCount ++;
    			else if (board[x][y] != currentPlayer)
						colorCount = 0;
			
				if (colorCount>3 || board[x][y]==null) break;
    		}
    	}
    	else {
    		colorCount=0;
    		for(;y<board[row].length;y++,x--){
    			if (board[x][y] === currentPlayer)
    				colorCount ++;
    			else if (board[x][y] != currentPlayer)
						colorCount = 0;
			
				if (colorCount>3 || board[x][y]==null) break;
    		}
    	}
    	if(colorCount>3) return true;
    }
    ;
    
    //Execution
	get("startGame").onclick = function(){
		//alert('hey');
			begin();
	};
})(document);