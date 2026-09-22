const link1 = document.getElementById('link1');
const link2 = document.getElementById('link2');
const link3 = document.getElementById('link3');
const prev = document.querySelector('#prev')
const next = document.querySelector('#next')
const produtos = document.querySelector('#produtos')


function startAnimation(elem, xPosition, duracao){
    gsap.to(elem, {
        opacity: 1,
        x: xPosition,
        duration: duracao,
        ease: "power2.out",
        //scrollTrigger: {
        //    trigger: inicio,
         //   start: "top center",
            
         //   markers: true,
            //scrub: true
        //}
    })
}

startAnimation(link1, -50, 1)
startAnimation(link2, 50, 2)
startAnimation(link3, -50, 3)

function letrasNimation(efeito, xPosition){
    gsap.to(efeito, {
        x: xPosition,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
            trigger: produtos,
            start: "top center",
            end: 'bottom center',
            scrub: true
        }
    })
}

letrasNimation(prev, 100)
letrasNimation(next, -80)
