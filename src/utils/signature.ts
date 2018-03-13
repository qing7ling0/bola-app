export class Signature {
  private ongoingTouches: Array<any> = new Array();
  private canvas: HTMLCanvasElement = null;
  private linex: Array<any> = new Array();
  private liney: Array<any> = new Array();
  private linen: Array<any> = new Array();
  private lastX: number = 1;
  private lastY: number = 30;
  private flag: number = 0;
  private context: any = null;

  constructor(canvas:HTMLCanvasElement) {
    this.canvas = canvas;
    this.ongoingTouches = [];
  }

  //设置事件处理程序
  startup() {
    let ret = `<script type="text\/javascript">$("#canvas").jSignature();<\/script>`
    document.write(ret);
    // let can:any = document.getElementById('canvas');
    // can.jSignature()
    // this.context = this.canvas.getContext('2d');
    // var el = document.getElementsByTagName("canvas")[0];
    // el.addEventListener("touchstart", this.handleStart, false);
    // el.addEventListener("touchend", this.handleEnd, false);
    // el.addEventListener("touchcancel", this.handleCancel, false);
    // el.addEventListener("touchleave", this.handleEnd, false);
    // el.addEventListener("touchmove", this.handleMove, false);
  }

  //图片记录
  onMouseMove(evt) {
    if (this.flag == 1) {
      this.linex.push(evt.layerX);
      this.liney.push(evt.layerY);
      this.linen.push(1);
      this.context.save();
      this.context.translate(this.context.canvas.width / 2, this.context.canvas.height / 2);
      this.context.translate(-this.context.canvas.width / 2, -this.context.canvas.height / 2 - 33);
      this.context.beginPath();
      this.context.lineWidth = 2;
      for (var i = 1; i < this.linex.length; i++) {
        this.lastX = this.linex[i];
        this.lastY = this.liney[i];
        if (this.linen[i] == 0)
          this.context.moveTo(this.lastX, this.lastY);
        else
          this.context.lineTo(this.lastX, this.lastY);
      }
      this.context.shadowBlur = 10;
      this.context.stroke();
      this.context.restore();
    }
  }

  //处理触摸开始事件
  handleStart = (evt) => {
    evt.preventDefault(); //阻止事件的默认行为
    //log("touchstart.");
    var el = document.getElementsByTagName("canvas")[0];
    var ctx = el.getContext("2d");
    var touches = evt.changedTouches;

    for (var i = 0; i < touches.length; i++) {
      //log("touchstart:" + i + "...");
      this.ongoingTouches.push(this.copyTouch(touches[i]));
      var color = this.colorForTouch(touches[i]);
      ctx.beginPath();
      ctx.arc(touches[i].pageX, touches[i].pageY, 4, 0, 2 * Math.PI, false);  // a circle at the start
      ctx.fillStyle = color;
      ctx.fill();
      //log("touchstart:" + i + ".");
    }
  }

  //处理触摸移动事件
  handleMove = (evt) => {
    evt.preventDefault();
    var el = document.getElementsByTagName("canvas")[0];
    var ctx = el.getContext("2d");
    var touches = evt.changedTouches;

    for (var i = 0; i < touches.length; i++) {
      var color = this.colorForTouch(touches[i]);
      var idx = this.ongoingTouchIndexById(touches[i].identifier);

      if (idx >= 0) {
        //log("continuing touch " + idx);
        // ctx.beginPath();
        //log("ctx.moveTo(" + this.ongoingTouches[idx].pageX + ", " + this.ongoingTouches[idx].pageY + ");");
        // ctx.moveTo(this.ongoingTouches[idx].pageX, this.ongoingTouches[idx].pageY);
        //log("ctx.lineTo(" + touches[i].pageX + ", " + touches[i].pageY + ");");
        ctx.lineTo(touches[i].pageX, touches[i].pageY);
        ctx.lineWidth = 6;
        ctx.strokeStyle = color;
        ctx.stroke();

        this.ongoingTouches.splice(idx, 1, this.copyTouch(touches[i]));  // swap in the new touch record
          //log(".");
      } else {
          // log("can't figure out which touch to continue");
      }
    }
  }

  //处理触摸结束事件
  handleEnd = (evt) => {
    evt.preventDefault();
    //log("touchend/touchleave.");
    var el = document.getElementsByTagName("canvas")[0];
    var ctx = el.getContext("2d");
    var touches = evt.changedTouches;

    for (var i = 0; i < touches.length; i++) {
      var color = this.colorForTouch(touches[i]);
      var idx = this.ongoingTouchIndexById(touches[i].identifier);

      if (idx >= 0) {
          ctx.lineWidth = 6;
          ctx.fillStyle = color;
          ctx.beginPath();
          ctx.moveTo(this.ongoingTouches[idx].pageX, this.ongoingTouches[idx].pageY);
          ctx.lineTo(touches[i].pageX, touches[i].pageY);
          ctx.fillRect(touches[i].pageX - 4, touches[i].pageY - 4, 8, 8);  // and a square at the end
          this.ongoingTouches.splice(idx, 6);  // remove it; we're done
      } else {
          // log("can't figure out which touch to end");
      }
    }
  }

  //处理触摸对出事件
  handleCancel = (evt) => {
    evt.preventDefault();
    //log("touchcancel.");
    var touches = evt.changedTouches;

    for (var i = 0; i < touches.length; i++) {
      this.ongoingTouches.splice(i, 1);  // remove it; we're done
    }
  }

  //选择颜色
  colorForTouch(touch) {
    var r: any = touch.identifier % 16;
    var g: any = Math.floor(touch.identifier / 3) % 16;
    var b: any = Math.floor(touch.identifier / 7) % 16;
    r = r.toString(16); // make it a hex digit
    g = g.toString(16); // make it a hex digit
    b = b.toString(16); // make it a hex digit
    var color = "#" + r + g + b;
    //log("color for touch with identifier " + touch.identifier + " = " + color);
    return color;
  }

  //拷贝一个触摸对象
  copyTouch(touch) {
    return { identifier:touch.identifier, pageX:touch.pageX, pageY:touch.pageY };
  }

  //找出正在进行的触摸
  ongoingTouchIndexById(idToFind) {
    for (var i = 0; i < this.ongoingTouches.length; i++) {
      var id = this.ongoingTouches[i].identifier;

      if (id == idToFind) {
        return i;
      }
    }
    return -1;    // not found
  }

  //记录日志
  log(msg) {
      // var p = document.getElementById('log');
      //p.innerHTML = msg + "\n" + p.innerHTML;
  }

  // 重画
  rewrite() {
    this.linex = new Array();
    this.liney = new Array();
    this.linen = new Array();
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.preview();
  }
  preview() {
    var show = document.getElementById("previewShow");
    show.innerHTML = "";
    show.appendChild(this.convertCanvasToImage(this.canvas));
    // window.history.go(-1);
    //alert(window.location.search);
    setTimeout("location.href='../pageApp/index.html'", 3000);
    //location.href="../index.html" ;
  }

  //    save() {
  //        var textarea = document.getElementById("textarea");
  //        textarea.innerHTML = "";
  //        textarea.appendChild(convertCanvasToImage(canvas));
  //    }

  convertCanvasToImage(canvas) {
    var image = new Image();
    image.width = 300;
    image.height = 125;
    image.src = canvas.toDataURL("i/png");
    console.log("image" + image);
    return image;
  }

}
