document.querySelector('#step1').addEventListener('click', ()=> browser.tabs.update({loadReplace: true, url: 'https://www.uvic.ca/cas/login'}))
document.querySelector('#step2').addEventListener('click', ()=> browser.tabs.update({loadReplace: false, url: 'https://www.uvic.ca/mypage/f/student-services/normal/render.uP#bwskfshd.P_CrseSchdDetl'}))
