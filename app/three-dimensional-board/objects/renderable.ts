import { Light } from './light';

export interface Renderable {
    initializeShaders(): void;
    initializeBuffers(): void;
    draw(projection: Matrix, modelView: Matrix, lights: Light[]): void;
}