import Link from "next/link";

const Page = () => {
  return (
    <div className="flex h-screen">

    <main className="flex-1 bg-gray-100 p-6">
        <h1 className="text-3xl font-bold justify-self-center">Career Paths for You & Me</h1><br></br>
        <h4 className="text-xl font-semibold justify-evenly">College Majors</h4><br></br>
        <div className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold"> 
                <h3>Major Title: Computer Science</h3>
                <p>Descripion: Lorem ipsum dolor sit amet, consectetur adipisicing elit. Consequuntur ratione nemo cupiditate excepturi nihil, et veniam ipsam totam laborum ipsum reiciendis saepe animi optio fugia</p>
                <br></br>
                <img
                  src="/collegegrad.jpg" 
                  alt="Motivational"
                  className="object-contain w-full h-full" 
                />
                <label>Learn More:</label>
                <a href="https://www.coursera.org/articles/what-is-computer-science"
                className="text-blue-500 hover:underline">
                     <ul>
                        <li>
                        What is Computer Science?
                        </li>
                        </ul>
                </a>
              </h3>
        </div>
</main>
</div>

  );
};

export default Page;