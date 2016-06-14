class InputMgr {
    constructor(game) {
        this.game = game;
        this.mouse = {
            pos: { x: 0, y: 0 },
            left: { down: false, pos: { x: 0, y: 0 }, duration: 0 },
            right: { down: false, pos: { x: 0, y: 0 }, duration: 0 }
        };

        document.addEventListener('mousemove', this._onMouseMove.bind(this));
        document.addEventListener('mousedown', this._onMouseDown.bind(this));
        document.addEventListener('mouseup', this._onMouseUp.bind(this));
    }

    update() {
        let mouseState = this.mouse;

        if (mouseState.left.down) {
            mouseState.left.duration++;
        } else {
            mouseState.left.duration = 0;
        }

        if (mouseState.right.down) {
            mouseState.right.duration++;
        } else {
            mouseState.right.duration = 0;
        }
    }

    _onMouseDown(e) {
        let mouseState = this.mouse;
        mouseState.downPos = { x: e.offsetX, y: e.offsetY };

        if (e.button === 0) {
            mouseState.left.down = true;
            mouseState.left.pos = mouseState.downPos;
        }

        if (e.button === 1) {
            mouseState.right.down = true;
            mouseState.right.pos = mouseState.downPos;
        }
    }

    _onMouseUp(e) {
        let mouseState = this.mouse;
        mouseState.upPos = { x: e.offsetX, y: e.offsetY };

        if (e.button === 0) {
            mouseState.left.down = false;
            mouseState.left.pos = mouseState.upPos;
        }

        if (e.button === 1) {
            mouseState.right.down = false;
            mouseState.right.pos = mouseState.upPos;
        }
    }

    _onMouseMove(e) {
        let mouseState = this.mouse;
        mouseState.pos = { x: e.offsetX, y: e.offsetY };
    }
}