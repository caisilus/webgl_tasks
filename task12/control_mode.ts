import {Drawer} from "../src/drawer";

export interface ControlMode {
    setup(): void
    
    onKeyUp(event: KeyboardEvent): void;
 
    update(drawer: Drawer): void;
}