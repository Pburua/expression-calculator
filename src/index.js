function eval() {
    // Do not use eval!!!
    return;
}

function isOperation(check) {
    return check === '-' || check === '+' || check === '*' || check === '/';
}

function isBracket(check){
    return check === '(' || check === ')';
}

function getPrRange(check) {
    if (check === '-' || check === '+')
        return 0;
    else if (check === '*' || check === '/')
        return 1;
    return -1;
}

function calc(array, i) {
    switch (array[i]){
        case '+':
            return parseFloat(array[i-1]) + parseFloat(array[i+1]);
        case '-':
            return parseFloat(array[i-1]) - parseFloat(array[i+1]);
        case '*':
            return parseFloat(array[i-1]) * parseFloat(array[i+1]);
        case '/': {
            if (array[i + 1] === '0')
                throw TypeError('TypeError: Division by zero.');
            return parseFloat(array[i - 1]) / parseFloat(array[i + 1]);
        }
    }
}

function getNextOpenBracketIndex(array, index, right){
    for (let i = index; i <= right; i++) {
        if (array[i] === '(')
            return i;
    }
    return -1;
}

function getNextCloseBracketIndex(array, index, right){
    for (let i = index; i <= right; i++) {
        if (array[i] === ')')
            return i;
    }
    return -1;
}

function getNextBracketIndex(array, index, right){

    for (let i = index; i <= right; i++) {
        if (array[i] === ')' || array[i] === '(')
            return i;
    }
    return -1;

}

function getCloseBracketIndexForOpenBracket(array, index, right){
    let nest_level = 1;

    if(index === -1) {
        // console.log("неа");
        return -1;
    }

    for (let j = index; j <= right;) {

        j = getNextBracketIndex(array, j+1, right);

        if(j === -1)
            throw TypeError('ExpressionError: Brackets must be paired');
        else if(array[j] === '(') {
            nest_level++;
            // console.log("угу");
        }
        else if(array[j] === ')') {
            nest_level--;
        }

        if(nest_level === 0)
            return j;
    }
    return -1;
}

function calcArray(array, left, right) {

    let right_move = 0;

    // console.log('recusive!..');
    // console.log(array);

    // console.log(array);
    // console.log(array[left]);
    // console.log(array[right]);

    for(let i = left; i <= right;) {
        // console.log(array.slice(left, right+1));
        // consol/e.log(array);

        let o_b_i = getNextOpenBracketIndex(array, i, right);

        // console.log('o_b_i:'+o_b_i);

        if (o_b_i === -1 && getNextCloseBracketIndex(array, i, right) !== -1){
            throw TypeError('ExpressionError: Brackets must be paired');
        }

        if (o_b_i === -1) {
            // console.log('break');
            break;
        }

        let c_b_i = getCloseBracketIndexForOpenBracket(array, o_b_i, right);

        // console.log('c_b_i:'+c_b_i);

        if (c_b_i === -1){
            throw TypeError('ExpressionError: Brackets must be paired');
        }
        else {
            let add_right_move = calcArray(array, o_b_i+1, c_b_i-1);

            right -= add_right_move;
            right_move += add_right_move;

            array.splice(o_b_i, 3, array[o_b_i+1]);

            right -= 2;
            right_move += 2;

            i = o_b_i;

            // console.log(array);
            // console.log(right);
        }

        // if(o_b_i === -1 && c_b_i === -1){
        //     break;
        // } if (o_b_i !== -1 && c_b_i !== -1){
        //
        //     let right_move = calcArray(array, o_b_i+1, c_b_i-1);
        //
        //     right -= right_move;
        //
        //     array.splice(o_b_i, 3, array[o_b_i+1]);
        //
        //     right -= 2;
        // }


    }

    // console.log(array);

    // console.log('ОБРАБОТКА');

    while(right !== left){

        let prior_value = 0,
            max_pr_range = 0,
            max_pr_value = 0,
            max_pr_index = 0,
            operation_found_flag = false;

        for(let i = right; i > left; i--){

            if(isOperation(array[i])){

                if(!operation_found_flag){
                    max_pr_range = getPrRange(array[i]);
                    max_pr_value = prior_value;
                    max_pr_index = i;
                    operation_found_flag = true;

                } else {
                    if ((max_pr_range < getPrRange(array[i]))
                        || (max_pr_range === getPrRange(array[i]) && max_pr_value < prior_value)) {

                        max_pr_range = getPrRange(array[i]);
                        max_pr_value = prior_value;
                        max_pr_index = i;
                    }
                }

                prior_value++;
            }

        }

        // console.log(array[max_pr_index]);
        // console.log(getPrRange('+'));
        // console.log(calc(array, max_pr_index));

        // console.log(array);
        // console.log(right);
        array.splice(max_pr_index-1, 3, calc(array, max_pr_index));

        right -= 2;
        right_move += 2;
    }

    // console.log('up!');

    // console.log(array);

    return right_move;

}

String.prototype.splicer = function(start, delCount, newSubStr) {
    return this.slice(0, start) + newSubStr + this.slice(start + Math.abs(delCount));
};

function addSpaces(str) {

    for(let i = 0 ; i < str.length; i++){
        if(isOperation(str[i]) || isBracket(str[i])){
            str = str.splicer(i, 1, ' '+str[i]+' ');
            i++;
        }
    }
    return str;
}

function clearArray(array) {
    for(let i = 0; i < array.length; i++){
        if(array[i] === '') {
            array.splice(i, 1);
            i--;
        }
    }
}

function expressionCalculator(expr) {

    expr = addSpaces(expr);

    let array = expr.split(" ");

    clearArray(array);

    calcArray(array, 0, array.length-1);

    console.log(array);

    return array[0];

}

module.exports = {
    expressionCalculator
};
