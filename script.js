'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector('.nav');

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};
btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  const s1cords = section1.getBoundingClientRect();

  //scrolling 
  //window.scrollTo(s1cords.left + pageXOffset, s1cords.top + window.pageYOffset);

  //mordern
  // window.scrollTo({
  //   left: s1cords.left + window.pageXOffset,
  //   top: s1cords.top + window.pageYOffset,
  //   behavior: 'smooth'
  // });

  //more mordern way
  section1.scrollIntoView({ behavior: 'smooth' });
});
///////////////////////////////////
//Page Navigation
// document.querySelectorAll('.nav__link').forEach
//   (function (el) {
//     el.addEventListener('click', function (e) {
//       e.preventDefault();
//       const id = this.getAttribute('href');
//       document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//     })
//   })

//more efficient way 
document.querySelector('.nav__links').addEventListener
  ('click', function (e) {
    e.preventDefault();
    //matching strategy
    if (e.target.classList.contains('nav__link')) {
      const id = e.target.getAttribute('href');
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
  });

//tabbed component
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  //guard clause
  if (!clicked) return;

  //active tab 
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //activate tab
  clicked.classList.add('operations__tab--active');

  //activate content area
  document.querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');

})

//menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');
    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};
// Passing "argument" into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));

//another way to do the abaove
// nav.addEventListener('mouseover',function(e){
//   if(e.target.classList.contains('nav__link')){
//     const link = e.target;
//     const siblings = link.closet('.nav').querySelector('.nav__link');
//     const logo = link.closet('.nav').querySelector('.img');
//     siblings.forEach(el=>{
//       if(el!=link) el.style.opacity = 1;
//     });
//     logo.style.opacity =1;
//   }
// });
nav.addEventListener('mouseout', handleHover.bind(1));

//sticky navigation
//scroll event is not efficient and should be avoid because it firea all the time even in the small change
// const intialcords = section1.getBoundingClientRect();

// window.addEventListener('scroll', function (e) {
//   if (this.window.scrollY > intialcords.top) nav.classList.add('sticky');
//   else nav.classList.remove('sticky');
// })

//intersecton of server APi
//it allows our code to observe the changes to the way when certain element intersects the another element
//demo
// const obsCallBack = function (entries,observer){
//   entries.forEach(entry => {
//     console.log(entry);
//   });
// };
// const obsOptions = {
//   root : null,
//   thershold : [0,0.2],
// };

// const observer =new IntersectionObserver(obsCallBack,obsOptions);
// observer.observer(section1);


const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headObserver = new IntersectionObserver(
  stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
}
);
headObserver.observe(header);

//reveal sections
const allSections = document.querySelectorAll('.section');
const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
}

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15
});
allSections.forEach((section) => {
  sectionObserver.observe(section);
  //section.classList.add('section--hidden')
});

//lazy loading images
const imgTargets = document.querySelectorAll('img[data-src]');
const loadimg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.classList.remove('lazy-img');
  entry.target.addEventListener('load', function () {
  });
  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadimg, {
  root: null,
  threshold: 0,
  rootMargin: '200px',
});
imgTargets.forEach(img => imgObserver.observe(img));

const slider = function () {
  //slider compomnt
  // const slider = document.querySelector('.slider');
  // slider.style.transform = 'scale(0.4) translateX(-800px)';
  // slider.style.overflow = 'visible';

  const slides = document.querySelectorAll('.slide');
  const dotcontainer = document.querySelector('.dots');
  const gotoslide = (slide) => {
    slides.forEach((s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`));
  }

  const btnLeft = document.querySelector('.slider__btn--left')
  const btnRight = document.querySelector('.slider__btn--right')

  let curslide = 0;
  const maxslide = slides.length;

  //////dots button slider
  const createdots = () => {
    slides.forEach((_, i) => {
      dotcontainer.insertAdjacentHTML('beforeend',
        `<button class = "dots__dot" data-slide = "${i}"></button>`)
    })
  }


  const activatedot = (slide) => {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  //next slide

  const nextslide = () => {
    if (curslide === maxslide - 1)
      curslide = 0;
    else
      curslide++;
    activatedot(curslide);
    gotoslide(curslide);
  };
  const prevslide = () => {
    if (curslide === 0)
      curslide = maxslide - 1;
    else
      curslide--;

    gotoslide(curslide);
    activatedot(curslide);
  };

  const init = () => {
    gotoslide(0);
    createdots();
    activatedot(0);
  }
  init();

  btnRight.addEventListener('click', nextslide);
  btnLeft.addEventListener('click', prevslide);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') prevslide();
    e.key === 'ArrowRight' && nextslide();
  });





  dotcontainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;

      gotoslide(slide);
      activatedot(slide);
    }
  });
};
slider();
///////////////////////////////////////

// const h1 = document.querySelector('h1');

// h1.addEventListener('mouseenter', function (e) {
//   alert('headin g hai ye be ');
// });
// document.querySelector('.nav__link').addEventListener
//   ('click', function (e) {
//     console.log('LINK');
//   })

// document.querySelector('.nav__links').addEventListener
//   ('click', function (e) {
//     console.log('LINK');
//   })

// document.querySelector('.nav').addEventListener
//   ('click', function (e) {
//     console.log('LINK');
//   })




















// /////////////////////////////////////////////////////
// ////////////////////////////////////////////////////
// //selecting elements
// console.log(document.documentElement);
// console.log(document.body);
// const header = document.querySelector('.header');
// const allselector = document.querySelectorAll('.selection');
// console.log(allselector);
// document.getElementById('section--1');
// const allbuttons = document.getElementsByTagName('button');
// console.log(allbuttons);

// //creating and inserting elements
// //.insertAjacent HTMl

// const message = document.createElement('div');//this is not in webpage if we want this in webpage we have to manually insert in in a webpage
// message.classList.add('cookie-message');
// //message.textContent = 'we use cookies to improve functionallity'
// message.innerHTML =
//   'we use cookies to improve functionallity.<button class = "btn btn--close--cookie"> Got it </button>';

// header.prepend(message);//first child
// header.append(message);//last child
// //header.append(message.cloneNode(true)); //this will clone this message

// document.querySelector('.btn--close--cookie')
//   .addEventListener('click', function () {
//     //message.remove();
//     message.parentElement.removeChild(message);//another way 
//   })

// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// document.documentElement.style.setProperty('--color-primary', 'orangered');

// // attributes
// const logo = document.querySelector('.nav__logo');
// console.log(logo.alt);
// console.log(logo.src);
// console.log(logo.designer);

//const h1 = document.querySelector('h1');

//h1.closest('.header').style.background = 'var(--gradient-secondary)'; //badia property



// DOM CONTENT LOADER EVENT

//this event is fired when HTMl is completely downloaded and converted into dom tree

document.addEventListener('DOMContentLoaded', function (e) {
  console.log('html dom tree built');
})

window.addEventListener('load', e => {
  console.log('page fully loaded', e); // these will be displayed in network tab
})


// to confirm u want to leave this site (something like that)
// window.addEventListener('beforeunload', function (e) {
//   e.preventDefault();
//   console.log(e);
//   e.returnValue = '';
// })










