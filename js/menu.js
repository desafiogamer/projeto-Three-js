let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('.Menu3d li a');
let navLinksMobi = document.querySelectorAll('.navbar a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 100;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(Links => {
                Links.classList.remove('active');
                document.querySelector('.Menu3d li a[href*=' + id + ']').classList.add('active');
            });
            navLinksMobi.forEach(Links => {
                Links.classList.remove('active');
                document.querySelector('.navbar a[href*=' + id + ']').classList.add('active');
            });
        }
    });
}
