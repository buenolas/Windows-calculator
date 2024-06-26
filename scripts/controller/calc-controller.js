class calcController{
    constructor(){
        this._lastOperator = ''; // get the last operator
        this._lastNumber = ''; //get the last number
        this._operation = []; // get the number then operator then number again in an array and do the operation
        this._displayCalcEl = document.querySelector("#display");
        this.initialize();
        this.initButtons();
        this.initKeyboard();
    }

     pasteFromClipboard(){

        document.addEventListener('paste', e=>{

            let text = e.clipboardData.getData('Text');
        
            this.displayCalc = parseFloat(text);

        })


    }

    copyToClipboard(){

        let input = document.createElement('input');

        input.value = this.displayCalc;

        document.body.appendChild(input);

        input.select();

        document.execCommand("Copy");

        input.remove();

    }

    initialize(){
        
        this.pasteFromClipboard();
        this.setLastNumberToDisplay();

    }

    addEventListenerAll(element, events, fn){

        events.split(' ').forEach(event=>{                  // to catch also click also drag

            element.addEventListener(event, fn, false);

        });

    }

    setError(){ //set error on display

        this.displayCalc = "error";

    }

    getLastOperation(){

        return this._operation[this._operation.length-1];       

    }

    isOperator(value){ //verify if it is a operator

        return(['+', '-', '*', '/', '%'].indexOf(value) > -1);

    }

    setLastOperation(value){ 

        this._operation[this._operation.length-1] = value;

    }

    pushOperation(value){ // get the value then push in the array, and verify if the length of the array is higher than 3 is true, if it is then call this.calc() to calculate. 

        this._operation.push(value);

        if(this._operation.length > 3){
            this.calc();
        }

    }

    getResult(){

        try{
            return eval(this._operation.join(""));
        }catch(e){
            setTimeout(()=>{
                this.setError();
            }, 1);
        }

    }


    calc(){
        
        let last = '';
        this._lastOperator = this.getLastItem(); //get the last operator on the array

        if(this._operation.length < 3){ // verify if the array have the appropriate length

            if(this._lastOperator == ''){ //if the last operator is empty, then return
                return;
            }
            
            let firstItem = this._operation[0]; //get the first item, may be a number or not
            
            this._operation = [firstItem, this._lastOperator, this._lastNumber]; 
            

        }else if(this._operation.length > 3){ //right after picking the first three items if the next one is a operator then it calculate, "last" is going to be the operator and
                                              // "this._lastNumber" is the result

            last = this._operation.pop();
            console.log(last);
            this._lastNumber = this.getResult();
            console.log(this._lastNumber);

        }else if(this._operation.length == 3){
            

            if(this.getResult() == 0){ 
                this.displayCalc = this.getResult();

                let result = this.getResult();

                if(last == '%'){

                    result /= 100;

                    this._operation = [result];

                }
                else{
            
                    this._operation = [result];

                    if(last) this._operation.push(last);

                }
                return;
            }
            this._lastNumber = this.getLastItem(false);
        }
        let result = this.getResult();

        if(last == '%'){

            result /= 100;

            this._operation = [result];

        }
        else{
            
            
            this._operation = [result];

            if(last) this._operation.push(last);

        }

        this.setLastNumberToDisplay();

    }

    getLastItem(isOperator = true){
        let lastItem;
        for(let i = this._operation.length-1;i>=0; i--){

            if(this.isOperator(this._operation[i]) == isOperator){
                lastItem = this._operation[i];
                break;

            }
        }

        if(!lastItem){
            
            lastItem = (isOperator) ? this._lastOperator : this._lastNumber;
            
        }
        return lastItem;

    }

    addOperation(value){

        if(isNaN(this.getLastOperation())){ //check if it is not a number
            if(this.isOperator(value)){ //if its a operator
                
                this.setLastOperation(value); //set as operator
                
            }
            else{
                this.pushOperation(value);
                
                this._lastNumber = this.getLastItem(false);
                this.setLastNumberToDisplay();

            }
        }
        else{

            if(this.isOperator(value)){

                this.pushOperation(value);

            }
            else{
                let newValue = this.getLastOperation().toString() + value.toString(); 
                this.setLastOperation(newValue);

                this.setLastNumberToDisplay();

            }
        }
        

    }

    opposite(){
        if(isNaN(this.getLastOperation())){
            if(this.isOperator(this.getLastOperation())){

                this.addOperation(this._operation[0]*-1);

                this.calc();

            }
        }else{

            this._operation[0] *= -1;
            
            this.setLastNumberToDisplay(); 

        }

    }

    squareRoot(){

        let sqrt = Math.sqrt(this._operation[0]);

        this._operation = [sqrt];
        this._lastOperator = '';
        this._lastNumber = '';

        this.calc();

        this.setLastNumberToDisplay();

    }

    power(){

        let powTwo = Math.pow(this._operation[0], 2);

        this._operation = [powTwo];
        this._lastOperator = '';
        this._lastNumber = '';

        this.calc();

        this.setLastNumberToDisplay();


    }

    fraction(){

        let frac = 1 / this._operation[0];



        this._operation = [frac];
        this._lastOperator = '';
        this._lastNumber = '';

        this.calc();

        this.setLastNumberToDisplay();

    }

    clearAll(){

        this._operation = [];
        this._lastNumber = '';
        this._lastOperator = '';
        this.setLastNumberToDisplay();

    }

    clearEntry(){

        this._operation.pop();
        this.setLastNumberToDisplay();
    }

    execBtn(value){ //verify wich button was clicked

        switch(value){
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '0':
                this.addOperation(parseInt(value));
                break;
            case 'CE':
                this.clearEntry();
                break;
            case 'C':
                this.clearAll();
                break;
            case '←':
                this.clearEntry();
                break;
            case '÷':
                this.addOperation('/');
                break;
            case 'X':
                this.addOperation('*');
                break;
            case '-':
                this.addOperation('-');
                break;
            case '+':
                this.addOperation('+');
                break;
            case '=':
                this.calc();
                break;
            case '%':
                this.addOperation('%');
                break;
            case ',':
                this.addDot('.');   
                break;
            case '±':
                this.opposite();
                break;
            case '√':
                this.squareRoot();
                break;
            case 'x²':
                this.power();
                break;
            case '¹/x':
                this.fraction();
                break;

            default:
                this.setError();
                break;

        }


    }

    initKeyboard(){ //initialize the keyboard

        document.addEventListener('keyup', e=>{

            switch(e.key){

                case 'Escape':
                    this.clearAll();
                    break;
    
                case 'Backspace':
                    this.clearEntry();
                    break;
    
                case 'Enter':
                case '=':
                    this.calc();
                    break;
    
                case '+':
                case '-':
                case '*':
                case '/':
                case '%':
                    this.addOperation(e.key);
                    break;

                case '.':
                case ',':
                    this.addDot('.');
                    break;
    
                case '0':
                case '1':
                case '2':
                case '3':
                case '4':
                case '5':
                case '6':
                case '7':
                case '8':
                case '9':
                    this.addOperation(parseInt(e.key));
                    break;

                case 'c':
                    if(e.ctrlKey) this.copyToClipboard();
                    break;
            }

        })

    }

    initButtons(){ //initialize the buttons
        let buttonNum = document.querySelectorAll('.btn-number');

        let buttonOp = document.querySelectorAll('.btn-others');

        buttonNum.forEach(button => { //get the numbers
            this.addEventListenerAll(button, "click drag", e => {
                let num = button.textContent;
                this.execBtn(num);
            });
        });

        buttonOp.forEach(button =>{ //get the operators
            this.addEventListenerAll(button, "click drag", e =>{
                let operator = button.textContent;
                this.execBtn(operator);
            })
        })

    }
    
    isFloat(number){ //return a boolean
        return Number(number) === number && number % 1 !== 0;
    }
    
    setLastNumberToDisplay(){ //set the last number in the array on display
        let lastNumber = this.getLastItem(false);
        if(!lastNumber) lastNumber = 0; //if doesn't exist

        let lastNumberToDisplay;

        if(this.isFloat(lastNumber)){ //set the five plates maximum on display
            let lastNumMod = parseFloat(lastNumber.toFixed(5));
            
            lastNumberToDisplay = lastNumMod.toString().replace('.', ',');
        
            this.displayCalc = lastNumberToDisplay;


        }else{

        lastNumberToDisplay = lastNumber.toString().replace('.', ',');
        
        this.displayCalc = lastNumberToDisplay;

        }
    }

    addDot(){ 

        let lastOperation = this.getLastOperation();

        if(typeof lastOperation === 'string' && lastOperation.split('').indexOf('.') > -1) return;
        
        
        if(lastOperation == 0){ //if the last operation is 0 then just add a dot in it
            this.setLastOperation(lastOperation.toString() + '.');
        }
        else if(this.isOperator(lastOperation) || !lastOperation){ //verify if the last operation is an operator and if its empty
            
                this.pushOperation('0.');
            
        }else{
            if(this.isFloat(lastOperation)){ //verify if it is a float so it doesn't add two dots
                return;
            }
            else{ //everything else
                
                this.setLastOperation(lastOperation.toString() + '.');
            }
            
        }

        this.setLastNumberToDisplay(); //set in the display the last number

    }

    get displayCalc(){ // get the display 
        return this._displayCalcEl.innerHTML;
    }
    set displayCalc(value){ //set the value in the display
        
        if(value.toString().length > 11){ //the limit of number in the display
            this.setError();
            return false;
        }
        this._displayCalcEl.innerHTML = value;

    }

}
