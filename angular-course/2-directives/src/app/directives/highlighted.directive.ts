import {
  Directive,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  Output,
} from "@angular/core";

@Directive({
  selector: "[highlighted]",
  exportAs: "hl",
})
export class HighlightedDirective {
  @Input("highlighted")
  isHighlighted = false;

  @Output()
  toggleHighlight = new EventEmitter();

  constructor() {
    console.log("Directive created..");
  }

  // dom attribute
  //   @HostBinding("attr.disabled")  //dom property
  //   get cssClasses() {
  //     return "true";
  //   }

  @HostBinding("class.highlighted") //dom property
  get cssClasses() {
    return this.isHighlighted;
  }

  // @HostBinding('className')
  // get cssClasses() {
  //     return 'highlighted';
  // }

  @HostListener("mouseover", ["$event"])
  mouseOver($event) {
    console.log($event);

    this.isHighlighted = true;
    this.toggleHighlight.emit(this.isHighlighted);
  }

  @HostListener("mouseleave")
  mouseLeave() {
    this.isHighlighted = false;
    this.toggleHighlight.emit(this.isHighlighted);
  }

  toggle() {
    this.isHighlighted = !this.isHighlighted;
    this.toggleHighlight.emit(this.isHighlighted);
  }
}
