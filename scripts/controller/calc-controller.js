class calcController{
    constructor(){
        this._lastOperator = '';
        this._lastNumber = '';
        this._operation = [];
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

    setError(){

        this.displayCalc = "error";

    }

    getLastOperation(){

        return this._operation[this._operation.length-1];       

    }

    isOperator(value){

        return(['+', '-', '*', '/', '%'].indexOf(value) > -1);

    }

    setLastOperation(value){

        this._operation[this._operation.length-1] = value;

    }

    pushOperation(value){

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
        this._lastOperator = this.getLastItem();

        if(this._operation.length < 3){

            if(this._lastOperator == ''){
                return;
            }
            
            let firstItem = this._operation[0];
            
            this._operation = [firstItem, this._lastOperator, this._lastNumber];
            

        }else if(this._operation.length > 3){

            last = this._operation.pop();
            this._lastNumber = this.getResult();

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

        if(isNaN(this.getLastOperation())){
            if(this.isOperator(value)){
                
                this.setLastOperation(value);
                
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

    execBtn(value){

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

    initKeyboard(){

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

    initButtons(){
        let buttonNum = document.querySelectorAll('.btn-number');

        let buttonOp = document.querySelectorAll('.btn-others');

        buttonNum.forEach(button => {
            this.addEventListenerAll(button, "click drag", e => {
                let num = button.textContent;
                this.execBtn(num);
            });
        });

        buttonOp.forEach(button =>{
            this.addEventListenerAll(button, "click drag", e =>{
                let operator = button.textContent;
                this.execBtn(operator);
            })
        })

    }
    
    isFloat(number){
        return Number(number) === number && number % 1 !== 0;
    }
    
    setLastNumberToDisplay(){
        let lastNumber = this.getLastItem(false);
        if(!lastNumber) lastNumber = 0;

        let lastNumberToDisplay;

        if(this.isFloat(lastNumber)){
            let lastNumMod = parseFloat(lastNumber.toFixed(3));
            
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

        if(this.isOperator(lastOperation) || !lastOperation){

            this.pushOperation('0.');

        }else{

            this.setLastOperation(lastOperation.toString() + '.');

        }

        this.setLastNumberToDisplay();

    }

    get displayCalc(){
        return this._displayCalcEl.innerHTML;
    }
    set displayCalc(value){

        if(value.toString().length > 11){
            this.setError();
            return false;
        }
        this._displayCalcEl.innerHTML = value;

    }

}