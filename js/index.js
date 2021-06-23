class Stack {
    constructor() {
        this.items = [];
    }

    push(element) {
        this.items.push(element);
    }

    pop(element) {
        if (this.items.length == 0) return "underflow";
        else return this.items.pop();
    }

    top() {
        return this.items[this.items.length - 1];
    }

    clear() {
        while (this.items.length != 0) {
            this.items.pop();
        }
    }

    isEmpty() {
        return this.items.length == 0;
    }
}

class Queue {
    constructor() {
        this.items = [];
    }

    isEmpty() {
        return this.items.length == 0;
    }

    push(element) {
        this.items.push(element);
    }

    pop() {
        if (this.isEmpty()) return "underflow";
        else return this.items.shift();
    }

    front() {
        if (this.isEmpty()) return "empty";
        else return this.items[0];
    }
}

createMatrix();

function clearMatrix() {
    return new Promise((res, rej) => {
        let matrix = document.getElementById('matrix');
        if (matrix == null) res();
        matrix.remove()
        res();
    })
}

function handleHover(event) {

    if (document.querySelector('.end').attributes.setEnd.value == "true") return;
    if (document.querySelector('.start').attributes.setStart.value == "true") return;

    let row = event.target.attributes.row.value;
    let col = event.target.attributes.col.value;
    let curBlock = document.getElementById(row + ':' + col);

    if (curBlock.classList.contains('perm-blocked')) return;
    if (curBlock.classList.contains('start-block')) return;
    if (curBlock.classList.contains('end-block')) return;
    if (curBlock.classList.contains('blocked')) {
        curBlock.classList.remove('blocked');
    }
    curBlock.classList.add('free');
}

function handleClick(event) {
    let row = event.target.attributes.row.value;
    let col = event.target.attributes.col.value;
    let curBlock = document.getElementById(row + ':' + col);

    let isStart = document.querySelector('.start').attributes.setStart.value;
    let isEnd = document.querySelector('.end').attributes.setEnd.value;

    if (isStart == "true") {
        if (curBlock.classList.contains('end-block')) {
            displayWarning("start-end-same");
            return;
        }
        if (curBlock.classList.contains('perm-blocked')) curBlock.classList.remove('perm-blocked');
        if (curBlock.classList.contains('free')) curBlock.classList.remove('free');
        curBlock.classList.add('start-block');
        document.querySelector('.start').attributes.setStart.value = "false";
        return;
    } else if (isEnd == "true") {

        if (curBlock.classList.contains('start-block')) {
            displayWarning("start-end-same");
            return;
        }
        if (curBlock.classList.contains('perm-blocked')) curBlock.classList.remove('perm-blocked');
        if (curBlock.classList.contains('free')) curBlock.classList.remove('free');
        curBlock.classList.add('end-block');
        document.querySelector('.end').attributes.setEnd.value = "false";
        return;
    }

    if (curBlock.classList.contains('end-block') || curBlock.classList.contains('start-block')) return;

    if (curBlock.classList.contains('perm-blocked')) {
        curBlock.classList.remove('perm-blocked');
        curBlock.classList.add('blocked');
        return;
    }

    if (curBlock.classList.contains('free')) curBlock.classList.remove('free');

    curBlock.classList.add('perm-blocked');
}

function createMatrix() {
    clearMatrix().then(() => {
        let rows = document.getElementById('rows').value;
        let cols = document.getElementById('cols').value;

        let matrix = document.createElement('div');
        matrix.setAttribute('id', 'matrix');

        for (let i = 0; i < rows; i++) {
            let row = document.createElement('div');
            row.classList.add('row');
            for (let j = 0; j < cols; j++) {
                let block = document.createElement('div');
                block.classList.add('block', 'blocked');
                block.setAttribute('onmouseover', 'handleHover(event)');
                block.setAttribute('row', i);
                block.setAttribute('col', j);
                block.setAttribute('id', i + ':' + j);
                block.setAttribute('onclick', 'handleClick(event)');
                row.appendChild(block);
            }
            matrix.appendChild(row);
        }
        document.getElementById('maze-container').appendChild(matrix);
    })
}

function reset() {
    let blocks = document.getElementsByClassName('block');
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].classList.contains('perm-blocked')) blocks[i].classList.remove('perm-blocked');
        if (blocks[i].classList.contains('free')) blocks[i].classList.remove('free');
        if (blocks[i].classList.contains('blocked') == false) blocks[i].classList.add('blocked');
    }
}

function setStart() {
    let blocks = document.getElementsByClassName('block');
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].classList.contains('start-block')) blocks[i].classList.remove('start-block');
    }
    document.querySelector('.start').attributes.setStart.value = 'true';
}

function setEnd() {
    let blocks = document.getElementsByClassName('block');
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].classList.contains('end-block')) blocks[i].classList.remove('end-block');
    }
    document.querySelector('.end').attributes.setEnd.value = 'true';
}

function setAlgorithm(event, algo) {
    document.querySelector('.algorithm').attributes.algorithm.value = algo;
    let bfs = document.querySelector('.bfs');
    let dfs = document.querySelector('.dfs');

    if (bfs.classList.contains('selected')) bfs.classList.remove('selected');
    if (dfs.classList.contains('selected')) dfs.classList.remove('selected');

    event.target.classList.add('selected');
}

function closeWarning() {
    let warning = document.getElementById('warning');
    if (warning == null) return;
    else warning.innerHTML = '';
}

function displayWarning(error) {

    let warningDiv = document.getElementById('warning');

    let warning = document.createElement('div');
    if (error == "start-end-null") {
        warning.innerText = 'Please select Start and End Blocks';
    } else if (error == "row-col-2") {
        warning.innerText = 'Rows and Columns cannot be less than 2';
    } else if (error == "start-end-same") {
        warning.innerText = 'Start and End points cannot be same';
    } else if (error == "no-path") {
        warning.innerText = 'No path exists!';
    }
    warning.classList.add('warning-text');

    let closeButton = document.createElement('div');
    closeButton.classList.add('close-warning');
    closeButton.setAttribute('onclick', 'closeWarning()');
    closeButton.innerText = "X";
    closeWarning();
    warningDiv.appendChild(warning);
    warningDiv.appendChild(closeButton);
}

async function run() {

    let rows = document.getElementById('rows').value;
    let cols = document.getElementById('cols').value;

    if (rows < 2 || cols < 0) {
        displayWarning("row-col-2");
        return;
    }
    let startBlock = document.querySelector('.start-block');
    let endBlock = document.querySelector('.end-block');

    if (startBlock == null || endBlock == null) {
        displayWarning("start-end-null");
        return;
    }

    await disableDivs();

    let algorithm = document.querySelector('.algorithm').attributes.algorithm.value;
    if (algorithm == "BFS") BFS();
    else DFS();
}

function getMatrix(rows, cols, val) {
    let visited = [];
    for (let i = 0; i < rows; i++) {
        let tempArr = [];
        for (let j = 0; j < cols; j++) {
            tempArr.push(val);
        }
        visited.push(tempArr);
    }
    return visited;
}

function BFS() {

    let rows = document.getElementById('rows').value;
    let cols = document.getElementById('cols').value;

    let visited = getMatrix(rows, cols, false);
    let distance = getMatrix(rows, cols, Infinity);
    let matrix = getMatrix(rows, cols, 0);
    let blocks = document.getElementsByClassName('block');

    let queue = new Queue();
    let endNode = { row: null, col: null };

    for (let i = 0; i < blocks.length; i++) {
        let row = blocks[i].attributes.row.value;
        let col = blocks[i].attributes.col.value;
        let state = 0;

        if (blocks[i].classList.contains('start-block')) {
            state = 11;
            queue.push({ row, col });
            visited[row][col] = true;
            distance[row][col] = 0;
        } else if (blocks[i].classList.contains('end-block')) {
            state = 12;
            endNode.row = row;
            endNode.col = col;
        } else if (blocks[i].classList.contains('free')) {
            state = 1;
        }

        matrix[row][col] = state;
    }

    let rowMove = [0, -1, 1, 0];
    let colMove = [1, 0, 0, -1];

    function isBounded(curNode) {
        if (curNode.row < 0 || curNode.row >= rows) return false;
        if (curNode.col < 0 || curNode.col >= cols) return false;
        return true;
    }

    function bfsUtil() {
        let answerPath = [];

        while (queue.isEmpty() == false) {

            let curNode = queue.pop();
            answerPath.push(curNode);

            if (matrix[curNode.row][curNode.col] == 12) break;

            for (let i = 0; i < 4; i++) {

                let newNode = { row: null, col: null };
                newNode.row = parseInt(curNode.row) + parseInt(rowMove[i]);
                newNode.col = parseInt(curNode.col) + parseInt(colMove[i]);

                if (isBounded(newNode) && matrix[newNode.row][newNode.col] != 0) {
                    if (visited[newNode.row][newNode.col] == false) {
                        visited[newNode.row][newNode.col] = true;
                        queue.push(newNode);
                        distance[newNode.row][newNode.col] = distance[curNode.row][curNode.col] + 1;
                    }
                }
            }
        }
        return answerPath;
    }

    let answerPath = bfsUtil();
    // console.log(distance)
    printPath(answerPath, endNode, "BFS");
}

function DFS() {

    let rows = document.getElementById('rows').value;
    let cols = document.getElementById('cols').value;

    let visited = getMatrix(rows, cols, false);

    let matrix = getMatrix(rows, cols, 0);
    let blocks = document.getElementsByClassName('block');

    /*
        states
        1 - free
        0 - blocked
        11 - start
        12 - end
    */
    let st = new Stack();
    let endNode = { row: null, col: null };

    for (let i = 0; i < blocks.length; i++) {
        let row = blocks[i].attributes.row.value;
        let col = blocks[i].attributes.col.value;
        let state = 0;

        if (blocks[i].classList.contains('start-block')) {
            state = 11;
            st.push({ row, col });
            visited[row][col] = true;
        } else if (blocks[i].classList.contains('end-block')) {
            state = 12;
            endNode.row = row;
            endNode.col = col;
        } else if (blocks[i].classList.contains('free')) {
            state = 1;
        }

        matrix[row][col] = state;
    }

    let rowMove = [0, -1, 1, 0];
    let colMove = [1, 0, 0, -1];

    function isBounded(curNode) {
        if (curNode.row < 0 || curNode.row >= rows) return false;
        if (curNode.col < 0 || curNode.col >= cols) return false;
        return true;
    }

    function dfsUtil() {

        let answerPath = [];

        while (st.isEmpty() == false) {

            let curNode = st.pop();
            answerPath.push(curNode);

            if (matrix[curNode.row][curNode.col] == 12) break;

            for (let i = 0; i < 4; i++) {

                let newNode = { row: null, col: null };
                newNode.row = parseInt(curNode.row) + parseInt(rowMove[i]);
                newNode.col = parseInt(curNode.col) + parseInt(colMove[i]);

                if (isBounded(newNode) && matrix[newNode.row][newNode.col] != 0) {
                    if (visited[newNode.row][newNode.col] == false) {
                        visited[newNode.row][newNode.col] = true;
                        st.push(newNode);
                    }
                }
            }
        }
        return answerPath;
    }
    let answerPath = dfsUtil();
    printPath(answerPath, endNode, "DFS");

}

function printPath(answerPath, endNode, algorithm) {

    let i = 0, n = answerPath.length;
    let speed = document.getElementById('speed-controller').value;
    let blockDisplayer = setInterval(showBlock, 2000 / speed);

    function showBlock() {
        if (document.getElementById('terminate-algorithm').attributes.terminate.value == "true") {
            clearInterval(blockDisplayer);
            return;
        } else if (i == n) {
            clearInterval(blockDisplayer);
            displayWarning("no-path")
            return;
        } else if (answerPath[i].row == endNode.row && answerPath[i].col == endNode.col) {
            clearInterval(blockDisplayer);
            if (algorithm == "BFS") displayShortestPath();
            return;
        } else {
            document.getElementById(answerPath[i].row + ':' + answerPath[i].col).classList.add('visited');
            i++;
        }
    }
}

function displayShortestPath() {

}

function terminateAlgorithm() {
    document.getElementById('terminate-algorithm').attributes.terminate.value = "true";
    removeDisabledDiv();
}

function disableDivs() {
    let divsTobeDisabled = document.getElementsByClassName('to-be-disabled');
    for (let i = 0; i < divsTobeDisabled.length; i++) {
        divsTobeDisabled[i].classList.add('disabled-div');
    }
    document.getElementById('terminate-algorithm').classList.remove('disabled-div');
    document.getElementById('terminate-algorithm').attributes.terminate.value = "false";
}

function removeDisabledDiv() {
    let blocks = document.getElementsByClassName('block');
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].classList.contains('visited')) {
            blocks[i].classList.remove('visited');
        }
        if (blocks[i].classList.contains('shortest-path')) {
            blocks[i].classList.contains('shortest-path');
        }
    }

    let disabledDivs = document.getElementsByClassName('to-be-disabled');

    for (let i = 0; i < disabledDivs.length; i++) {
        disabledDivs[i].classList.remove('disabled-div');
    }

    document.getElementById('terminate-algorithm').classList.add('disabled-div');
}

speedController();
function speedController() {
    let speedControl = document.getElementById('speed-controller')
    speedControl.oninput = function () {
        document.getElementById('display-speed').innerText = (parseInt(this.value) / 10) + 'x';
    }
}

function invertBlocks() {
    let blocks = document.getElementsByClassName('block');
    let n = blocks.length;
    for (let i = 0; i < n; i++) {
        if (blocks[i].classList.contains('end-block') || blocks[i].classList.contains('start-block')) {
            continue;
        } else if (blocks[i].classList.contains('free')) {
            blocks[i].classList.remove('free');
            blocks[i].classList.add('blocked');
        } else {
            if (blocks[i].classList.contains('perm-blocked')) {
                blocks[i].classList.remove('perm-blocked');
            }
            if (blocks[i].classList.contains('blocked')) {
                blocks[i].classList.remove('blocked');
            }
            blocks[i].classList.add('free');
        }
    }
}

async function generateRandomMaze() {

    await createMatrix();

    let blocks = document.getElementsByClassName('block');
    let blocksLen = blocks.length;

    // let upperBound = Math.floor(0.99 * blocksLen);
    // let lowerBound = Math.floor(0.95 * blocksLen);
    // let noofBlocksTobeRemoved = Math.floor(Math.random() * (upperBound - lowerBound + 1) + lowerBound);
    let noofBlocksTobeRemoved = blocksLen;

    while (noofBlocksTobeRemoved--) {

        let blockIndex = Math.floor(Math.random() * blocksLen);
        if (blocks[blockIndex].classList.contains('blocked')) {
            blocks[blockIndex].classList.remove('blocked');
            blocks[blockIndex].classList.add('free');
        }
    }

    let startBlockIndex = Math.floor(Math.random() * blocksLen);
    let endBlockIndex = Math.floor(Math.random() * blocksLen);

    while (endBlockIndex == startBlockIndex) {
        endBlockIndex = Math.floor(Math.random() * blocksLen);
    }

    blocks[startBlockIndex].classList.add('start-block');
    blocks[endBlockIndex].classList.add('end-block');
}

