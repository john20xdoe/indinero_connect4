(function(htmlfile){
var
	board = new Array(6),
	currentPlayer = 'red', //versus 'yellow'
	get = function(id){
        return htmlfile.getElementById(id);
    },
    cell = function(row,col){
    	return get('cell'+row+'-'+col);
    },
    switchPlayer = function(){
    	alert(currentPlayer);
    	switch(currentPlayer){
    		case 'red':{ 
    			currentPlayer = 'yellow';
    			break;
    		}
    		default: currentPlayer ='red'
    	}
    },
    prepareBoard = function(){
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
    			cellsHTML += '<td class="'+board[row][col]+'" id="cell'+row+'-'+col+'"><a>'+board[row][col]+'<br>'+row+'-'+col+'</a></td>';
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

		for (col=board[row].length-1;col >= 0;col--){
			for (row=board.length-1; row >= 0;row--){	
				if(board[row][col].length > 0){
					continue;
				}else{
					cell(row,col).onclick=null;
					cell(row,col).onclick = function(row,col){
						return function(){   //we need to force early binding para di mawala si row,col
							//alert('clicked '+row+':'+col +' with value: '+board[row][col]);
							board[row][col]=currentPlayer;
							switchPlayer();
							updateBoardView();
							cell(row,col).onclick=null;
						}
					}(row,col)
					break ;
				}
			}
		}
    }
    ;
    


    //Execution
	get("startGame").onclick = function(){
		//alert('hey');
			prepareBoard();
			updateBoardView();
	};
})(document);