export interface IAttribute {
    name: string;
    valuesCount: number;
    glType: number;
    dataNormalized: boolean;
    parentByteSize: number;
    offsetInParent: number;
}