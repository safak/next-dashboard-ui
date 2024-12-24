import CareerCard from "./CareerCard";

const Page = () => {
  const cards = [
    {
      title: "Computer Science",
      description:
        "With the tech industry's rapid growth, this major is in high demand, covering software development, data science, AI, cybersecurity, and more.",
      imageUrl: "/compsci.jpg",
      linkText: "What is Computer Science?",
      linkUrl: "https://www.coursera.org/articles/what-is-computer-science",
    },
    {
      title: "Business Administration",
      description:
        "This versatile major prepares students for leadership roles in companies, covering areas like management, finance, marketing, and entrepreneurship.",
      imageUrl: "/business.jpg",
      linkText: "Learn About Business Administration",
      linkUrl: "https://www.businessnewsdaily.com/",
    },
    {
      title: "Nursing",
      description:
        "A major focused on healthcare and patient care, which continues to be in high demand as the healthcare industry grows.",
      imageUrl: "/nursing.webp",
      linkText: "Explore Nursing Careers",
      linkUrl: "https://nurse.org/",
    },
    {
      title: "Psychology",
      description:
        "The study of human behavior, emotions, and mental processes, which is popular among students interested in counseling, therapy, research, and human resources.",
      imageUrl: "/psychology.jpg",
      linkText: "Discover Psychology",
      linkUrl: "https://www.apa.org/",
    },
    {
      title: "Biology",
      description:
        "A foundational major for students pursuing careers in medicine, research, environmental science, and biotechnology.",
      imageUrl: "/biology.jpg",
      linkText: "Learn About Biology",
      linkUrl: "https://www.nature.com/",
    },
    {
      title: "Engineering",
      description:
        "Engineering majors, including electrical, civil, mechanical, and chemical, are popular for students interested in technical, problem-solving careers.",
      imageUrl: "/engineering.jpg",
      linkText: "Learn About Engineering",
      linkUrl: "https://www.engineering.com/",
    },
    {
      title: "Education",
      description:
        "This major prepares students for teaching and education-related roles, including early childhood education, secondary education, and special education.",
      imageUrl: "/education.jpg",
      linkText: "Explore Education Careers",
      linkUrl: "https://www.education.com/",
    },
    {
      title: "Health Professions",
      description:
        "Other than nursing, this includes majors like public health, pre-med, dental hygiene, and physical therapy, all geared towards careers in healthcare.",
      imageUrl: "/health.webp",
      linkText: "Discover Health Professions",
      linkUrl: "https://explorehealthcareers.org/",
    },
    {
      title: "Communication",
      description:
        "A broad field covering journalism, public relations, advertising, and media studies, which is popular for students interested in media and communication roles.",
      imageUrl: "/communications.jpg",
      linkText: "Explore Communication",
      linkUrl: "https://www.communicationstudies.com/",
    },
    {
      title: "Finance and Accounting",
      description:
        "These majors are popular for students interested in working in banking, investment, corporate finance, and accounting.",
      imageUrl: "/finance.jpg",
      linkText: "Learn About Finance",
      linkUrl: "https://www.investopedia.com/",
    },
    {
      title: "Political Science",
      description:
        "A major focusing on government, politics, international relations, and law, often pursued by students interested in public service, law, or policy-making.",
      imageUrl: "/politics.jpeg",
      linkText: "Discover Political Science",
      linkUrl: "https://www.apsanet.org/",
    },
    {
      title: "Art and Design",
      description:
        "Including fine arts, graphic design, animation, and digital media, these majors are popular for students interested in creative careers.",
      imageUrl: "/art.jpg",
      linkText: "Learn About Art and Design",
      linkUrl: "https://www.aiga.org/",
    },
    {
      title: "Sociology",
      description:
        "The study of society, social behavior, and institutions, often pursued by students aiming for careers in social work, research, or public policy.",
      imageUrl: "/sociology.jpeg",
      linkText: "Discover Sociology",
      linkUrl: "https://www.asanet.org/",
    },
    {
      title: "Economics",
      description:
        "A major that focuses on the study of economies, markets, and resource allocation, offering career opportunities in business, government, and research.",
      imageUrl: "/economics.jpg",
      linkText: "Learn About Economics",
      linkUrl: "https://www.economicshelp.org/",
    },
    {
      title: "Environmental Science",
      description:
        "A growing field focused on understanding and addressing environmental challenges, appealing to students passionate about sustainability and conservation.",
      imageUrl: "/environmental.jpg",
      linkText: "Discover Environmental Science",
      linkUrl: "https://www.environmentalscience.org/",
    },
  ];
  
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="p-8">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Career Paths for You & Me
        </h1>
        <h4 className="text-xl font-semibold mb-4">College Majors</h4>
        <div className="flex flex-wrap justify-center">
          {cards.map((card, index) => (
            <CareerCard
              key={index}
              title={card.title}
              description={card.description}
              imageUrl={card.imageUrl}
              linkText={card.linkText}
              linkUrl={card.linkUrl}
            />
          ))}
        </div>
      </main>
    </div>

  );
};

export default Page;
