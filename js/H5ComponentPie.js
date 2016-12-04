/* 饼图组件对象 */
var H5ComponentPie = function (name, cfg) {
    var component = new H5ComponentBase(name,cfg);
    //  绘制网格线

    var w = cfg.width;
    var h = cfg.height;

    //  加入一个画布（网格线背景）

    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    component.append(cns);
    $(cns).css('zIndex',1);
    var r = w / 2;

    //  加入底图层
    ctx.beginPath();
    ctx.fillStyle = '#eee';
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;
    ctx.arc(r, r, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    //  绘制一个数据层
    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    $(cns).css('zIndex',2);
    component.append(cns);

    var colors = ['red', 'green', 'blue', 'orange', 'gray'];
    var sAngle = 1.5 * Math.PI;
    var eAngle = 0;
    var aAngle = 2 * Math.PI;

    var step = cfg.data.length;
    for (var i = 0; i < step; i++) {
        var item = cfg.data[i];
        var color = item[2] || (item[2] = colors.pop());
        eAngle = sAngle + aAngle * item[1];
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.moveTo(r, r);
        ctx.arc(r, r, r, sAngle, eAngle);
        ctx.fill();
        ctx.stroke();
        sAngle = eAngle;
        //  加入项目文本以及百分比
        var text = $('<div class="text">');
        text.text(cfg.data[i][0]);
        var per = $('<div class="per">');
        per.text(cfg.data[i][1] * 100 + '%');
        text.append(per);

        var x = r + Math.sin(0.5 * Math.PI - sAngle) * r;
        var y = r + Math.cos(0.5 * Math.PI - sAngle) * r;
        if (x > w / 2) {
            text.css('left', 5 + x / 2);
        } else {
            text.css('right', 5 + (w - x) / 2);
        }

        if (cfg.data[i][2]) {
            text.css('color', cfg.data[i][2]);
        }

        text.css('opacity', 0);

        if (y > h / 2) {
            text.css('top', 5 + y / 2);
        } else {
            text.css('bottom', 5 + (h - y) / 2);
        }
        component.append(text);

    }
    // 加入一个蒙板层

    var cns = document.createElement('canvas');
    var ctx = cns.getContext('2d');
    cns.width = ctx.width = w;
    cns.height = ctx.height = h;
    $(cns).css('zIndex',3);
    component.append(cns);
    ctx.fillStyle = '#eee';
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 1;

    // 动画生长过程
    var draw = function (per) {

        if (per >= 1) {
            component.find('.text').css('opacity', 1);
        }

        if (per < 1) {
            component.find('.text').css('opacity', 0);
        }

        ctx.clearRect(0, 0, w, h);
        ctx.beginPath();
        ctx.moveTo(r, r);
        if (per <= 0) {
            ctx.arc(r, r, r, 0, 2 * Math.PI);
        } else {
            ctx.arc(r, r, r, sAngle, sAngle + 2 * Math.PI * per, true);
        }
        ctx.fill();
        ctx.stroke();
    };
    draw(0);
    component.on('onLoad',function () {
        var s = 0;
        for (i = 0; i < 100; i++) {
            setTimeout(function () {
                s += 0.01;
                draw(s);
            }, i * 10 + 500);
        }
    });
    component.on('onLeave',function () {
        var s = 1;
        for (i = 0; i < 100; i++) {
            setTimeout(function () {
                s -= 0.01;
                draw(s);
            },i*10);
        }
    });
    return component;
}