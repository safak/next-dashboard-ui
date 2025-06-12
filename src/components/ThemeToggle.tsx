'use client';

import { useEffect, useState } from 'react';

const ThemeToggle = () => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.theme || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.add(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.theme = newTheme;
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
  };

  return (
    <button onClick={toggleTheme} className='mt-10 flex justify-center w-12 lg:justify-start'>
      <span className='hidden lg:block h-[20px] w-[20px] lg:h-[24px] lg:w-[44px] pt-[5px] rounded-full bg-lightBgColor dark:bg-neutral-700 dark:shadow-neutral-900 shadow-inner border-gray-200 dark:border-neutral-950 border relative'>
        <span className='flex items-center justify-between mx-[4px]'>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='12' height='12'>
            <g>
              <path d='M16.258,7.586h0c-.209,0-.396-.13-.469-.325l-.322-.863c-.183-.488-.572-.873-1.068-1.055l-.873-.319c-.197-.072-.328-.26-.328-.47s.131-.397,.328-.47l.873-.319c.496-.182,.886-.566,1.069-1.056l.321-.862c.073-.196,.26-.325,.469-.325h0c.208,0,.395,.129,.468,.325l.323,.862c.184,.49,.572,.874,1.069,1.056l.872,.319c.197,.072,.328,.26,.328,.47s-.131,.397-.328,.47l-.872,.319c-.497,.182-.886,.566-1.068,1.055l-.324,.863c-.072,.195-.26,.325-.468,.325Zm-1.176-3.031c.503,.263,.912,.67,1.176,1.169,.264-.499,.674-.906,1.177-1.169-.503-.263-.913-.67-1.177-1.169-.264,.499-.674,.907-1.176,1.17Z' />
              <path d='M12.023,22.995C5.945,22.995,1,18.052,1,11.977,1,6.264,5.285,1.549,10.969,1.009c.214-.03,.421,.102,.507,.302,.085,.2,.031,.433-.134,.575-1.278,1.098-1.899,2.942-1.899,5.637,0,4.996,2.039,7.034,7.037,7.034,2.76,0,4.551-.604,5.637-1.902,.141-.168,.373-.226,.576-.141,.202,.084,.326,.291,.306,.508-.536,5.686-5.254,9.973-10.975,9.973ZM9.721,2.223C5.236,3.263,2,7.243,2,11.977c0,5.524,4.496,10.018,10.023,10.018,4.732,0,8.711-3.226,9.756-7.701-1.262,.857-2.986,1.263-5.3,1.263-3.742,0-8.037-.913-8.037-8.034,0-2.271,.42-4.02,1.278-5.3Z' />
            </g>
          </svg>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            width='12'
            height='12'
            stroke='gray'
          >
            <path d='M12,17c-2.76,0-5-2.24-5-5s2.24-5,5-5,5,2.24,5,5-2.24,5-5,5Zm0-9c-2.21,0-4,1.79-4,4s1.79,4,4,4,4-1.79,4-4-1.79-4-4-4Zm.5-3.5V.5c0-.28-.22-.5-.5-.5s-.5,.22-.5,.5V4.5c0,.28,.22,.5,.5,.5s.5-.22,.5-.5Zm0,19v-4c0-.28-.22-.5-.5-.5s-.5,.22-.5,.5v4c0,.28,.22,.5,.5,.5s.5-.22,.5-.5ZM5,12c0-.28-.22-.5-.5-.5H.5c-.28,0-.5,.22-.5,.5s.22,.5,.5,.5H4.5c.28,0,.5-.22,.5-.5Zm19,0c0-.28-.22-.5-.5-.5h-4c-.28,0-.5,.22-.5,.5s.22,.5,.5,.5h4c.28,0,.5-.22,.5-.5Zm-6.15-5.15l3-3c.2-.2,.2-.51,0-.71s-.51-.2-.71,0l-3,3c-.2,.2-.2,.51,0,.71,.1,.1,.23,.15,.35,.15s.26-.05,.35-.15ZM3.85,20.85l3-3c.2-.2,.2-.51,0-.71s-.51-.2-.71,0l-3,3c-.2,.2-.2,.51,0,.71,.1,.1,.23,.15,.35,.15s.26-.05,.35-.15ZM6.85,6.85c.2-.2,.2-.51,0-.71L3.85,3.15c-.2-.2-.51-.2-.71,0s-.2,.51,0,.71l3,3c.1,.1,.23,.15,.35,.15s.26-.05,.35-.15Zm14,14c.2-.2,.2-.51,0-.71l-3-3c-.2-.2-.51-.2-.71,0s-.2,.51,0,.71l3,3c.1,.1,.23,.15,.35,.15s.26-.05,.35-.15Z' />
          </svg>
        </span>
        <span className='block lg:h-[20px] lg:w-[20px] bg-darkActiveColor rounded-full absolute top-[1px] dark:left-[2px] right-[2px]'></span>
      </span>
      <span className=' lg:hidden dark:rotate-180'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          id='Layer_1'
          data-name='Layer 1'
          viewBox='0 0 24 24'
          width='25'
          height='25'
          fill='grey'
        >
          <path d='m16,4h-8C3.589,4,0,7.589,0,12s3.589,8,8,8h8c4.411,0,8-3.589,8-8s-3.589-8-8-8Zm0,13c-2.757,0-5-2.242-5-5s2.243-5,5-5,5,2.242,5,5-2.243,5-5,5Z' />
        </svg>
      </span>
    </button>
  );
};

export default ThemeToggle;
