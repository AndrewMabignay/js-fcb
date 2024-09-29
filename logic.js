/* Variables - Storage of Values ____________ */ 
let board;
let score = 0;
let rows = 4;
let column = 4;

// Used to monitor if the user already won once in the value of 2048, 4096, or 8192.
// If one of these variables became true, the player already won once in specific values.
let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;


// function to set the gameboard to have tiles ____________
function setGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0], 
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ]; // This board will be used as the Backend Board to design and modify the tiles of the Frontend Board.

    // Loop 
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < column; c++) {
            // Creates a Div Element 
            let tile = document.createElement("div");

            // Assign an id based on the position of the tile.
            tile.id = r.toString() + "-" + c.toString();

            // Retrieves the number of the tile from the backend board.
            let num = board[r][c];

            updateTile(tile, num);
            document.getElementById("board").append(tile);
        }
    }

    setTwo();
    setTwo();
}

console.log("Hello, World");

// This function is to update the color of the tile based on its num value.
function updateTile(tile, num) {
    tile.innerText = "";
    tile.classList.value = "";
    
    // <div class="tile"></div>
    tile.classList.add("tile");

    if (num > 0) {
        // Update the text content of the tile to show the number.
        tile.innerText = num.toString();

        if (num < 8192) {

            // <div class="tile x2">num</div>
            tile.classList.add("x" + num.toString());
        } else {
            tile.classList.add("x8192");
        }
    }
}

window.onload = function() {
    setGame(); // We Call the Set Game Function 
}

function handleSlide(e) {
    console.log(e.code);

    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) {
        if (e.code == "ArrowLeft") {
            slideLeft();
            setTwo();
        } else if (e.code == "ArrowRight") {
            slideRight();
            setTwo();
        } else if (e.code == "ArrowUp") {
            slideUp();
            setTwo();
        } else if (e.code == "ArrowDown") {
            slideDown();
            setTwo();
        }
    }

    //checkWin();
    document.getElementById('score').innerText = score;

    setTimeout(()=>{
		checkWin();
	}, 100)
			
	if (hasLost() == true) {
        setTimeout(()=>{
            alert("Game Over.");
            restartGame();
            alert ("Click any arrow to Start")
        }, 100)
	}
    /*
    setTimeout(()=>{
		checkWin();
	}, 100)
	*/
    /*		
	if (hasLost() == true){

        alert("Game Over.");
        restartGame();
        alert ("Click any arrow to Start")
        /*
        setTimeout(()=>{
            alert("Game Over.");
            restartGame();
            alert ("Click any arrow to Start")
        }, 100)
        */
	


    /*
    if (hasLost() == true) {
        setTimeout(() => {
            alert("Game Over. You have lost the game. Game will restart.");
            restartGame();
            //alert("Click any arrow key to restart");
        }, 100);
    }
    */
}

document.addEventListener("keydown", handleSlide);

function filterZero(row) {
    return row.filter(num => num != 0);
}

function slide(tiles) {
    // [2, 0, 2, 2] -> [2, 2, 2]
    tiles = filterZero(tiles);

    for (let i = 0; i < tiles.length - 1; i++) {
        if (tiles[i] == tiles[i + 1]) { // True
            tiles[i] *= 2; // [4, 2, 2]
            tiles[i + 1] = 0; // [4, 0, 2]

            score += tiles[i]; // Adds the Merge Tile Value to the Score.
        }
    } 

    tiles = filterZero(tiles); // [4, 2]

    while (tiles.length < column) {
        tiles.push(0); // [4, 2, 0, 0]
    }

    return tiles;
}

// Slide Left function will use slide function to merge matching adjacent tiles.
function slideLeft() {
    for (let r = 0; r < rows; r++) {
        let row = board[r];
        row = slide(row);
        board[r] = row;

        for (let c = 0; c < column; c++) {

            for (let c = 0; c < column; c++) {
                let tile = document.getElementById(r.toString() + "-" + c.toString());
                let num = board[r][c];
                updateTile(tile, num);
            }
        }
    }   
}

function slideRight() {
    for (let r = 0; r < rows; r++) {
        // All the tiles per row are saved in a container row.
        let row = board[r];

        // 2 2 2 0 -> 0 2 2 2
        row.reverse(); 
        
        row = slide(row); // Use slide function to merge the same values.
        // 4 2 0 0
        row.reverse();
        // 0 0 2 4

        board[r] = row;  // Update the row with the merge tiles.

        // Update the ID and Color of all the tiles from the first column of a row to its last column. 
        for (let c = 0; c < column; c++) {

            for (let c = 0; c < column; c++) {
                // Accesses the tile using it's ID.
                let tile = document.getElementById(r.toString() + "-" + c.toString());
                let num = board[r][c];
                updateTile(tile, num);
            }
        }
    }   
}

function slideUp() {
    for (let c = 0; c < column; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]]; // [0, 2, 2, 2]
        col = slide(col); // Slide Function to merge the same values.

        for (let r = 0; r < rows; r++) {
            board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }   
}

function slideDown() {
    for (let c = 0; c < column; c++) {
        let col = [board[0][c], board[1][c], board[2][c], board[3][c]]; // [0, 2, 2, 2]
        col.reverse();

        col = slide(col); // Slide Function to merge the same values.
        col.reverse();

        for (let r = 0; r < rows; r++) {
            board[r][c] = col[r];
            let tile = document.getElementById(r.toString() + "-" + c.toString());
            let num = board[r][c];
            updateTile(tile, num);
        }
    }
}

function hasEmptyTile() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < column; c++) {
            if (board[r][c] == 0) {
                return true;
            }
        }
    }

    return false;
}

function setTwo() {
    console.log(hasEmptyTile());
    if (hasEmptyTile() == false) {
        return;
    }

    let found = false;

    while (found == false) {
        // this will generate a random vlaue based on the rows value (0 - 1)
        let r = Math.floor(Math.random() * rows); // [random, r]
        let c = Math.floor(Math.random() * column); // [random, c]

        // if (board[random r][random c] == 0)
        if (board[r][c] == 0) {

            // if the tile is an empty tile, we convert the empty tile to 2 (0 -> 2)
            board[r][c] = 2;
            let tile = document.getElementById(r.toString() + "-" + c.toString());

            // <div class="x2">2</div>
            tile.innerText = "2";
            tile.classList.add("x2");

            found = true;
        }
    } 
}

function checkWin() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < column; c++) {
            if (board[r][c] == 2048 && is2048Exist == false) {
                alert("You win! You got the 2048.");
                is2048Exist = true;
            } else if (board[r][c] == 4096 && is4096Exist == false) {
                alert("You are unstoppable at 4096! You are fantastically unstoppable!");
                is4096Exist = true;
            } else if (board[r][c] == 8192 && is8192Exist == false) {
                alert("Victory! You have reach 8192! You are incredibly awesome!");
                is8192Exist = true;
            }
        }
    }
}

function hasLost() {
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < column; c++) {
            if (board[r][c] == 0) {
                return false;
            }
            
            const currentTile = board[r][c];

            if (
                r > 0 && board[r - 1][c] === currentTile || // Check if the current tile matches to the Upper Tile.
                r < rows - 1 && board[r + 1][c] === currentTile || // Check if the current tile matches to the Lower Tile
                c > 0 && board[r][c - 1] === currentTile || // Check if the current tile matches to the Left Tile
                c > column - 1 && board[r][c + 1] === currentTile // Check if the current tile matches to the Right Tile 
            ) {
                return false;
            }
        }
    }    
    // No possible moves - meaning true, the user has lost
    return true;
}

function restartGame() {
    board = [
        [0, 0, 0, 0],
        [0, 0, 0, 0], 
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];

    score = 0;
    setTwo();
}