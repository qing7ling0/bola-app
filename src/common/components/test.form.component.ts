import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export const EXE_COUNTER_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CounterComponent),
    multi: true
};

@Component({
    selector: 'exe-counter',
    template: `
    <div>
      <p>当前值: {{ count }}</p>
      <button (click)="increment()"> + </button>
      <button (click)="decrement()"> - </button>
    </div>
    `,
    providers: [EXE_COUNTER_VALUE_ACCESSOR]
})
export class CounterComponent implements ControlValueAccessor {
    @Input() _count: number = 0;

    get count() {
        return this._count;
    }

    set count(value: number) {
        this._count = value;
        this.propagateChange(this._count);
    }

    propagateChange = (_: any) => { };

    writeValue(value: any) {
        if (value) {
            this.count = value;
        }
    }

    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any) { }

    increment() {
        this.count++;
    }

    decrement() {
        this.count--;
    }
}