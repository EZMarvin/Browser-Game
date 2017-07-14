var global = require('./clientConfig');

class Canvas {
    constructor(params)  {
         this.directionLock = false;
         this.target = global.target;
         this.reenviar = true; // unlock for spliting 
         this.socket = global.socket;
         this.directions = [];
         var self = this;

         this.cv = document.getElementById('cvs');
         this.cv.width = global.screenWidth;
         this.cv.height = global.screenHeight;
         this.cv.addEventListener('mousemove', this.gameInput, false);
         this.cv.addEventListener('mouseout', this.outOfBounds, false);
         this.cv.addEventListener('keypress', this.keyInput, false);
         this.cv.addEventListener('keyup', function(event) {
             self.reenviar = true;
             self.pressUp(event);
         }, false);
        this.cv.addEventListener('keydown', this.pressDown, false);
        this.cv.parent = self;
        global.canvas = this;
    }

    gameInput(mouse) {
        if (!this.directionLock) {
            this.parent.target.x = mouse.clientX - this.width / 2;
            this.parent.target.y = mouse.clientY - this.height / 2;
            global.target = this.parent.target;
        }
    }

    // TODO : continue to move to mouse out direction
    outOfBounds() {
        if (!global.continuity) {
            this.parent.target = { x : 0, y : 0};
            global.target = this.parent.target;
        }
    }

    keyInput(event) {
        var key = event.which || event.keyCode;
        if (key === global.KEY_FIREFOOD && this.parent.reenviar) {
            this.parent.socket.emit('1');
            console.log('fire food');
            this.parent.reenviar = false;
        } else if (key === global.KEY_SPLIT && this.parent.reenviar) {
            this.parent.socket.emit('2');
            console.log('split up');
            this.parent.reenviar = false;
        } else if (key === global.KEY_CHAT) {
            document.getElementById('chatInput').focus();
        }
    }

    directional(key) {
        return this.isHorizontal(key) || this.isVertical(key);
    }

    isHorizontal(key) {
        return key == global.KEY_LEFT || key == global.KEY_RIGHT;
    }

    isVertical(key) {
        return key == global.KEY_DOWN || key == global.KEY_UP;
    }

    // When key press down get direction key info
    pressDown(event) {
        var key = event.which || event.keyCode;
        var self = this.parent;
        if (self.directional(key)) {
            this.directionLock = true; // lock the direction to pressed key direction 
            if (self.newDirection(key, self.directions, true)) {
                self.updateTarget(self.directions);
                self.socket.emit('0', self.target);
            }
        }
    }

    pressUp(event) {
        var key = event.which || event.keyCode;
        if (this.directional(key)) {
            if (this.newDirection(key, this.directions, false)) {
                this.updateTarget(this.directions);
                if (this.directions.length === 0) 
                    this.directionLock = false;
                this.socket.emit('0', this.target);
            }
        }
    }

    newDirection(direction, list, isAddition) {
    	var result = false;
    	var found = false;
    	for (var i = 0, len = list.length; i < len; i++) {
    		if (list[i] == direction) {
    			found = true;
                // if the key is up then remove the most recent direction
    			if (!isAddition) {
    				result = true;
    				list.splice(i, 1);
    			}
    			break;
    		}
    	}
    	// Adds new direction.
    	if (isAddition && found === false) {
    		result = true;
    		list.push(direction);
    	}

    	return result;
    }


    updateTarget(list) {
    	this.target = { x : 0, y: 0 };
    	var directionHorizontal = 0;
    	var directionVertical = 0;
    	for (var i = 0, len = list.length; i < len; i++) {
    		if (directionHorizontal === 0) {
    			if (list[i] == global.KEY_LEFT) directionHorizontal -= Number.MAX_VALUE;
    			else if (list[i] == global.KEY_RIGHT) directionHorizontal += Number.MAX_VALUE;
    		}
    		if (directionVertical === 0) {
    			if (list[i] == global.KEY_UP) directionVertical -= Number.MAX_VALUE;
    			else if (list[i] == global.KEY_DOWN) directionVertical += Number.MAX_VALUE;
    		}
    	}
    	this.target.x += directionHorizontal;
    	this.target.y += directionVertical;
        global.target = this.target;
    }

}

module.exports = Canvas;