

var animate_box_1 = anime({
    targets:'.box-1',
    translateX:560,
    duration:4000
});

var animate_ts = anime({
    targets:'#time-series',
    rotate:-180,
    duration:2500,
    endDelay:200,
    direction:'alternate'
});

var animate_box_2 = anime({
    targets:'.box-2',
    translateX:-580,
    duration:2500
});

var animate_tm = anime({
    targets:'#treemap',
    rotate:360,
    duration:4000
});

let animate_box_3 = anime({
    targets:'.box-3',
    width:'1000%',
    duration:1000,
    easing: 'easeInOutQuad',
    direction:'alternate'
});

var animate_btn = anime({
    targets: '.btn',
    rotate: 720,
    duration: 2500
})