import { use, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllJobs } from "../Api/Recruiter";
import { Link } from "react-router-dom";
function HomeCommn() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const allJobs = await getAllJobs(user);
        if (allJobs.data === null) {
          setData([]);
          setError(allJobs.msg?.substring(0, 100) || "No jobs found.");
        } else {
          setError(null);
         
          setData(allJobs.data);  
        }
      } catch (err) {
        setError("Failed to fetch jobs.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [count, user]);

  const getStatusColor = (status) => {
    return status === "Open" 
      ? "bg-green-100 text-green-700" 
      : "bg-gray-100 text-gray-600";
  };

  return (
    <div className="min-h-screen  ">
      
      <div className="relative overflow-hidden bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Find Your Dream Job Today
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Connect with us and unlock career opportunities 
              </p>
              <div className="flex gap-4">
                { ( user==null|| user.userName=='Unknown')&&
                <a
                  href="/login"
                  className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg"
                >
                  Get Started
                </a>
                }
                <a
                  href="#openings"
                  className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition"
                >
                  View Jobs
                </a>
              </div>
            </div>
            <div className="hidden md:block">
              <img
                src="/hero.png"
                alt="Career Growth"
                className="w-full mb-5 h-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
          </svg>
        </div>
      </div>

    
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Smart Matching</h3>
            <p className="text-gray-600">Smart candidate matching based on skills, experience, and job requirements</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Easy Application</h3>
            <p className="text-gray-600">Simple one-click application process with resume upload </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Fast Hiring</h3>
            <p className="text-gray-600">Streamlined interview scheduling and feedback system for quick decisions</p>
          </div>
        </div>
      </div>

   
      <div id="openings" className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Current Openings</h2>
          <p className="text-xl text-gray-600">
            {data.length > 0 ? `${data.length} position${data.length > 1 ? 's' : ''} available` : 'Explore opportunities'}
          </p>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading opportunities...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {!loading && data.length === 0 && !error && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <p className="text-xl text-gray-600">No open positions at the moment</p>
            <p className="text-gray-500 mt-2">Check back soon for new opportunities</p>
          </div>
        )}

        {!loading && data.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((job) => (
              <div
                key={job.jobId}
                className="bg-white rounded-2xl shadow-lg border-t-1 border-blue-500 hover:shadow-2xl transition-all duration-300 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                         <img src="./hiring.png"></img>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 ">
                          {job.title}
                        </h3>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {job.location}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="font-semibold">{job.minExperience}+ years</span> experience
                    </p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Required Skills:</p>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill.skillId}
                          className={`text-xs px-3 py-1 rounded-full font-medium ${
                            skill.skillType === "Required" 
                              ? "bg-blue-100 text-blue-700" 
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {skill.skillName}
                        </span>
                      ))}
                      {job.skills.length > 3 && (
                        <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-medium">
                          +{job.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                      {(user!=null && user.userName!='Unknown') ?
                  <Link to={ `/candidate/jobApply/${job.jobId}`}  className="block w-full text-center py-3  bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg" > 
                    See Details →
                  </Link>:
                  <a href="/login" className="block w-full text-center py-3  bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg" > 
                    See Details →
                  </a>
                  }
                  
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      { ( user==null|| user.userName=='Unknown')&&
      <div className="bg-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          
          <a
            href="/signup"
            className="inline-block px-10 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition shadow-lg text-lg"
          >
            Create Account
          </a>
        </div>
      </div>
      }
    </div>
  );
}

export default HomeCommn;
