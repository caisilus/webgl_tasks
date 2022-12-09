import {Drawer} from "./drawer";

export interface ControlMode {
    setup(drawer: Drawer): void;
    
    onKeyUp(event: KeyboardEvent): void;
 
    update(drawer: Drawer): void;
}