'use client';

import { Design, DesignChecklistItem, ChecklistItem, User } from '@prisma/client';
import { deleteDesign } from '@/app/actions/deleteDesign';
import { saveDesign } from '@/app/actions/saveDesign'; // Import saveDesign
import { useState } from 'react'; // Import useState

const inputClassNames = "border rounded px-2 py-1";
const staticTextClassNames = "text-lg block font-medium";
const labelClassNames = "text-sm font-light";
const sectionBorderClassNames = "border border-gray-300 dark:border-gray-600 rounded";


// Define props type including the checklistItems and company relations
interface DesignDetailClientPageProps {
  design: Design & {
    checklistItems: (DesignChecklistItem & {
      checklistItem: ChecklistItem | null;
      user: User | null;
    })[];
    company: { name: string }; // Add company relation
  };
}

export default function DesignDetailClientPage({ design }: DesignDetailClientPageProps) {
  const [isEditing, setIsEditing] = useState(false); // State to manage edit mode
  const [editedDesign, setEditedDesign] = useState(design); // State to hold edited data

  const handleSave = async () => {
    console.log('Attempting to save design:', editedDesign);
    try {
      // Transform checklistItems to match the expected input type
      const transformedChecklistItems = editedDesign.checklistItems.map(item => ({
        checklistItemId: item.checklistItemId === null ? undefined : item.checklistItemId,
        customText: item.customText === null ? undefined : item.customText, // Transform customText
        isChecked: item.isChecked,
      }));

      // Call saveDesign action with isNewCompany: false for updates
      await saveDesign({
        ...editedDesign,
        isNewCompany: false,
        checklistItems: transformedChecklistItems, // Use the transformed items
      });
      // The action redirects on success, so no need to setIsEditing(false) here
    } catch (error: any) {
      console.error('Failed to save design:', error);
      alert(`Failed to save design: ${error.message || 'An unknown error occurred'}`);
    }
  };

  const handleCancel = () => {
    setEditedDesign(design); // Revert changes
    setIsEditing(false); // Exit edit mode
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedDesign(prevState => ({
      ...prevState,
      [name]: value
    }));
  };


  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Design Details</h1> {/* Added styling */}
      <div className="bg-card text-card-foreground w-full text-left shadow-lg p-6 rounded-md"> {/* Added spacing */}
        <div className="border-lightEmphasisColor dark:border-darkEmphasisColor border-b mb-3"> {/* Added styling */}
          <h2 className="text-lg text-card-foreground font-bold mb-0">{design.templateName}</h2>
          <h3 className='text-sm font-thin text-card-foreground pt-0'>{design.company.name}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div> {/* Added grid layout */}
          <p className='text-sm font-light'>Template Name:{' '}
          {isEditing ? (
            <input
              type="text"
              name="templateName"
              value={editedDesign.templateName}
              onChange={handleChange}
              className={inputClassNames}
            />
          ) : (
            <span className={staticTextClassNames}>{design.templateName}</span>
          )}
          </p>
        </div>
        <div>
          <p className={labelClassNames}>Status:{' '}
          {isEditing ? (
             <input
              type="text" // Consider using a select dropdown for status
              name="status"
              value={editedDesign.status}
              onChange={handleChange}
              className={inputClassNames}
            />
          ) : (
            <span className={staticTextClassNames}>{design.status}</span>
          )}
          </p>
        </div>
        <div>
          <p className={labelClassNames}>Company ID:{' '}
          {isEditing ? (
             <input
              type="text" // Consider using a select dropdown for company
              name="companyId"
              value={editedDesign.companyId}
              onChange={handleChange}
              className={inputClassNames}
            />
          ) : (
            <span className={staticTextClassNames}>{design.companyId}</span>
          )}
          </p>
        </div>
        <div>
          <p className={labelClassNames}>Company Name:
          
            <span className={staticTextClassNames}>{design.company.name}</span>
            </p>
        </div>
        <div>
          <p className={labelClassNames}>User ID:{' '}
          {isEditing ? (
             <input
              type="text" // Consider using a select dropdown for user
              name="userId"
              value={editedDesign.userId || ''}
              onChange={handleChange}
              className={inputClassNames}
            />
          ) : (
            <span className={staticTextClassNames}>{design.userId}</span>
          )}
          </p>
        </div>
         <div>
          <p className={labelClassNames}>Partner:{' '}
          {isEditing ? (
             <input
              type="text"
              name="partners"
              value={editedDesign.partners || ''} // Handle null partners
              onChange={handleChange}
              className={inputClassNames}
            />
          ) : (
            <span className={staticTextClassNames}>{design.partners}</span>
          )}
          </p>
        </div>
        <p className={labelClassNames}>Created At: <span className='block font-medium'>{design.createdAt.toDateString()}</span></p> {/* Added bolding */}
        <p className={labelClassNames}>Updated At: <span className='block font-medium'>{design.updatedAt.toDateString()}</span></p> {/* Added bolding */}

        </div>
          
        <div>
          <p className={labelClassNames}>Design Notes:</p> {/* Added bolding */}
           {isEditing ? (
            <textarea
              name="designNotes"
              value={editedDesign.designNotes || ''} // Handle null notes
              onChange={handleChange}
              className={`${inputClassNames} w-full h-32`} // Added styling
            />
          ) : (
            <div className={`${sectionBorderClassNames} p-3 bg-gray-100 dark:bg-gray-700 whitespace-pre-wrap`}> {/* Added styling and pre-wrap for notes */}
              {design.designNotes || 'No notes available.'}
            </div>
          )}
        </div>

      </div>
      <div className="mt-6 flex space-x-4"> {/* Added margin top and spacing */}
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
              Save Design
            </button>
            <button
              onClick={handleCancel}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Edit Design
            </button>
            <button
              onClick={async () => {
                if (confirm('Are you sure you want to delete this design?')) {
                  const { success, error } = await deleteDesign(design.id);
                  if (success) {
                    window.location.href = '/list/designs'; // Redirect after successful deletion
                  } else {
                    alert(`Failed to delete design: ${error}`);
                  }
                }
              }}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Delete Design
            </button>
          </>
        )}
        <a href="/list/designs" className="text-blue-500 hover:underline flex items-center"> {/* Added styling */}
          Back to Designs
        </a>
      </div>
    </div>
  );
}
