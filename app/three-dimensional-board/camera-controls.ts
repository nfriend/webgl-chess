import { Key } from '../utility/keys';
import { Utility } from '../utility/utility';

export class CameraControls {
    private rotationX = 45;
    private rotationY = 345;
    private zoom = 25;

    private MAX_X = 80;
    private MIN_X = 10;
    private MAX_ZOOM = 35;
    private MIN_ZOOM = 15;
    private KEYBOARD_X_SPEED = 1;
    private KEYBOARD_Y_SPEED = 1;
    private KEYBOARD_ZOOM_SPEED = .3;
    private MOUSE_X_SPEED = .2;
    private MOUSE_Y_SPEED = .2;
    private MOUSE_ZOOM_SPEED = .01;

    private $el: JQuery;

    private currentKeys: { [keyCode: number]: boolean } = {};
    private startCoords: { x: number, y: number } = null;
    private lastCoords: { x: number, y: number } = null;

    public startListening = ($el: JQuery) => {
        this.$el = $el;
        $el.on('keydown', this.onKeyDown);
        $el.on('keyup', this.onKeyUp);
        $el.on('mousedown', this.onMouseDown);
        $el.on('mousemove', this.onMouseMove);
        $el.on('mouseup', this.onMouseUp);
        $el.on('mousewheel DOMMouseScroll', this.onScroll);
    }

    public stopListening = () => {
        this.$el.off('keydown', this.onKeyDown);
        this.$el.off('keyup', this.onKeyUp);
        this.$el.off('mousedown', this.onMouseDown);
        this.$el.off('mousemove', this.onMouseMove);
        this.$el.off('mouseup', this.onMouseUp);
        this.$el.off('mousewheel DOMMouseScroll', this.onScroll);
    }

    public update = () => {
        if (this.currentKeys[Key.LeftArrow]) {
            this.rotationY = (this.rotationY + this.KEYBOARD_Y_SPEED) % 360;
        }

        if (this.currentKeys[Key.RightArrow]) {
            this.rotationY = (360 + this.rotationY - this.KEYBOARD_Y_SPEED) % 360
        }

        if (this.currentKeys[Key.UpArrow]) {
            this.rotationX += this.KEYBOARD_X_SPEED;
        }

        if (this.currentKeys[Key.DownArrow]) {
            this.rotationX -= this.KEYBOARD_X_SPEED;
        }

        if (this.currentKeys[Key.Equals]) {
            this.zoom -= this.KEYBOARD_ZOOM_SPEED;
        }

        if (this.currentKeys[Key.Dash]) {
            this.zoom += this.KEYBOARD_ZOOM_SPEED;
        }

        if (this.startCoords && this.lastCoords) {
            const deltaX = this.lastCoords.x - this.startCoords.x;
            const deltaY = this.lastCoords.y - this.startCoords.y;

            this.rotationY += deltaX * this.MOUSE_Y_SPEED;
            this.rotationX += deltaY * this.MOUSE_X_SPEED;

            this.startCoords = this.lastCoords;
            this.lastCoords = null;
        }

        this.checkBounds();
    }

    private checkBounds = () => {
        if (this.rotationX > this.MAX_X) {
            this.rotationX = this.MAX_X;
        }
        if (this.rotationX < this.MIN_X) {
            this.rotationX = this.MIN_X;
        }
        if (this.zoom > this.MAX_ZOOM) {
            this.zoom = this.MAX_ZOOM;
        }
        if (this.zoom < this.MIN_ZOOM) {
            this.zoom = this.MIN_ZOOM;
        }
    }

    public getViewMatrix = () => {
        return Matrix.I(4)
            .multiply(Matrix.Translation($V([0, 0, -1 * this.zoom])).ensure4x4())
            .multiply(Matrix.RotationX(Utility.degreesToRadians(this.rotationX)).ensure4x4())
            .multiply(Matrix.RotationY(Utility.degreesToRadians(this.rotationY)).ensure4x4());
    }

    onKeyDown = (ev: JQueryKeyEventObject) => {
        this.currentKeys[ev.which] = true;
    }

    onKeyUp = (ev: JQueryKeyEventObject) => {
        this.currentKeys[ev.which] = false;
    }

    onMouseDown = (ev: JQueryMouseEventObject) => {
        this.startCoords = {
            x: ev.pageX,
            y: ev.pageY
        };
    }

    onMouseMove = (ev: JQueryMouseEventObject) => {
        this.lastCoords = {
            x: ev.pageX,
            y: ev.pageY
        };
    }

    onMouseUp = (ev: JQueryMouseEventObject) => {
        this.startCoords = this.lastCoords = null;
    }

    onScroll = (ev: JQueryMouseEventObject) => {
        ev.stopPropagation();
        ev.preventDefault();
        this.zoom -= (<any>ev.originalEvent).wheelDelta * this.MOUSE_ZOOM_SPEED;
        this.checkBounds();
    }
}