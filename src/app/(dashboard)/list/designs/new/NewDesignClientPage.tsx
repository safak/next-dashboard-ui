'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Define local interfaces mirroring necessary Prisma types
interface LocalCompany {
  id: number;
  name: string;
  // Add other fields from Prisma Company model if needed by this component
}

interface LocalUser {
  id: string;
  name: string | null;
  username: string;
  // Add other fields from Prisma User model if needed by this component
}

interface LocalDesignChecklistItem {
  id: number;
  checklistItemId: number | null;
  designId: number;
  isChecked: boolean;
  customText: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Add other fields from Prisma DesignChecklistItem model if needed
}

interface LocalDesign {
  id: number;
  companyId: number;
  templateName: string;
  partners: string | null;
  status: string; // Assuming status is a string enum or type
  designNotes: string | null;
  userId: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Add other fields from Prisma Design model if needed by this component
}


// Define a type for checklist items used in the component state
interface ChecklistItemState {
  id?: number; // Optional for custom items (refers to initialChecklistItems id)
  designChecklistItemId?: number; // ID if saved to the database (refers to DesignChecklistItem id)
  text: string;
  isChecked: boolean;
  isCustom: boolean;
  customText?: string; // Only for custom items
}

// Define a type for the Design data fetched with checklist items
type DesignWithChecklistItems = LocalDesign & {
  checklistItems: LocalDesignChecklistItem[];
  company: { name: string } | null; // Include company as it's also included in the fetch
};

// Define the initial checklist items (example data)
const initialChecklistItems = [
  { id: 1, text: 'Review requirements' },
  { id: 2, text: 'Create wireframes' },
  { id: 3, text: 'Develop prototype' },
  { id: 4, text: 'Get client feedback' },
  { id: 5, text: 'Finalize design' },
];

import { saveDesign } from '@/app/actions/saveDesign'; // Import server action
import { getDesignById, searchDesigns } from '@/lib/data'; // Import data fetching functions
// TODO: Import actual UI components if using a library (e.g., Shadcn, Material UI)

// Define props type using local interfaces
interface NewDesignClientPageProps {
  companies: LocalCompany[];
  users: LocalUser[]; // Use LocalUser type
}

// Type for search results using local interfaces
type DesignSearchResult = LocalDesign & {
  company: { name: string } | null;
};

const NewDesignClientPage: React.FC<NewDesignClientPageProps> = ({
  companies = [],
  users = [], // Add users to destructuring
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const designIdToEdit = searchParams.get('edit');

  // --- State ---
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(!!designIdToEdit);
  const [selectedDesignId, setSelectedDesignId] = useState<number | null>(
    designIdToEdit ? parseInt(designIdToEdit, 10) : null
  );

  // Form State
  const [companyId, setCompanyId] = useState<number | string>('');
  const [companyName, setCompanyName] = useState(''); // Add state for company name input
  const [isNewCompany, setIsNewCompany] = useState(false); // State to toggle company input mode
  const [templateName, setTemplateName] = useState('');
  const [partners, setPartners] = useState('');
  const [status, setStatus] = useState(''); // Consider using Status enum from Prisma
  const [notes, setNotes] = useState(''); // UI state for the notes textarea
  const [assignedUserId, setAssignedUserId] = useState<string>(''); // Add state for assigned user ID

  // Checklist State
  const [checklist, setChecklist] = useState<ChecklistItemState[]>([]);
  const [newCustomChecklistItem, setNewCustomChecklistItem] = useState('');

  // Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<DesignSearchResult[]>([]);

  // --- Data Fetching ---
  const fetchDesignData = useCallback(
    async (id: number) => {
      setIsLoading(true);
      console.log(`Fetching data for design ID: ${id}`);
      try {
        const designData: DesignWithChecklistItems | null = await getDesignById(id); // Use the imported function and new type
        console.log('Fetched design data:', designData);

        if (designData) {
          setCompanyId(designData.companyId);
          setCompanyId(designData.companyId);
          // If the company exists in the fetched list, set isNewCompany to false
          setIsNewCompany(!companies.some((c) => c.id === designData.companyId));
          setCompanyName(designData.company?.name || ''); // Set company name if available
          setTemplateName(designData.templateName);
          setPartners(designData.partners || '');
          setStatus(designData.status);
          setNotes(designData.designNotes || ''); // Use designNotes from fetched data
          setAssignedUserId(designData.userId || ''); // Set assigned user ID

          // Populate checklist state based on designData.checklistItems
          const fetchedChecklistItems: LocalDesignChecklistItem[] = designData.checklistItems || [];
          const adminChecklistMap = new Map(initialChecklistItems.map((item) => [item.id, item]));
          const designChecklistMap = new Map(
            fetchedChecklistItems.map((item) => [item.checklistItemId, item])
          );

          const mergedChecklist: ChecklistItemState[] = [];

          // 1. Add admin items, using saved state if available
          initialChecklistItems.forEach((adminItem) => {
            const savedState = designChecklistMap.get(adminItem.id);
            mergedChecklist.push({
              id: adminItem.id,
              designChecklistItemId: savedState?.id,
              text: adminItem.text,
              isChecked: savedState?.isChecked ?? false,
              isCustom: false,
            });
          });

          // 2. Add custom items saved specifically for this design
          fetchedChecklistItems.forEach((savedItem) => {
            if (savedItem.customText && !savedItem.checklistItemId) {
              // It's a custom item
              mergedChecklist.push({
                designChecklistItemId: savedItem.id,
                text: savedItem.customText,
                isChecked: savedItem.isChecked,
                isCustom: true,
                customText: savedItem.customText, // Ensure customText is populated
              });
            }
          });

          setChecklist(mergedChecklist);
        } else {
          console.error('Design not found for ID:', id);
          alert('Design not found. Redirecting to create new design.');
          setIsEditing(false);
          setSelectedDesignId(null);
          router.replace('/designs/new'); // Go back to create mode
        }
      } catch (error) {
        console.error('Error fetching design:', error);
        alert('Error fetching design data. Please try again.');
        // Optionally redirect or reset state
      } finally {
        setIsLoading(false);
      }
    },
    [initialChecklistItems, router, companies] // Added companies to dependencies
  ); // Added dependencies

  const handleSearch = useCallback(async (term: string) => {
    setSearchTerm(term);
    if (term.length > 1) {
      // Search with 2+ characters
      setIsLoading(true);
      try {
        const results = await searchDesigns(term); // Use imported function
        setSearchResults(results as DesignSearchResult[]); // Cast to expected type
      } catch (error) {
        console.error('Error searching designs:', error);
        setSearchResults([]);
        alert('Error searching designs.');
      } finally {
        setIsLoading(false);
      }
    } else {
      setSearchResults([]);
    }
  }, []); // No dependencies needed if searchDesigns is stable

  // --- Effects ---
  useEffect(() => {
    // Initialize checklist with admin items on initial load or when admin items change
    const initialItems = initialChecklistItems.map((item) => ({
      id: item.id,
      text: item.text,
      isChecked: false,
      isCustom: false,
    }));
    // Only set initial items if not editing or if checklist hasn't been populated yet
    if (!isEditing || checklist.length === 0) {
      setChecklist(initialItems);
    }

    // If editing, fetch the design data
    if (isEditing && selectedDesignId) {
      fetchDesignData(selectedDesignId);
    } else if (!isEditing) {
      // Reset form when switching from edit to create mode
      setCompanyId('');
      setTemplateName('');
      setPartners('');
      setStatus('');
      setNotes('');
      setAssignedUserId(''); // Reset assigned user
      setChecklist(initialItems); // Reset checklist to default admin items
      setIsNewCompany(false); // Reset company input mode
      setCompanyName(''); // Reset company name input
    }
    // Add fetchDesignData to dependency array as it's now wrapped in useCallback
  }, [initialChecklistItems, isEditing, selectedDesignId, fetchDesignData]);

  // --- Event Handlers ---
  const handleChecklistChange = (index: number) => {
    setChecklist((prev) =>
      prev.map((item, i) => (i === index ? { ...item, isChecked: !item.isChecked } : item))
    );
  };

  const handleAddCustomChecklistItem = () => {
    if (newCustomChecklistItem.trim()) {
      setChecklist((prev) => [
        ...prev,
        {
          text: newCustomChecklistItem.trim(),
          isChecked: false,
          isCustom: true,
          customText: newCustomChecklistItem.trim(), // Set customText here
        },
      ]);
      setNewCustomChecklistItem('');
    }
  };

  const handleRemoveCustomChecklistItem = (index: number) => {
    setChecklist((prev) => prev.filter((item, i) => !(i === index && item.isCustom)));
  };

  const handleSelectSearchResult = (design: DesignSearchResult) => {
    router.push(`/designs/new?edit=${design.id}`);
    setSearchTerm('');
    setSearchResults([]);
    // State update (including fetching data) will be triggered by the useEffect hook watching searchParams change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyId || !templateName || !status) {
      alert('Please fill in all required fields (Company, Template Name, Status).');
      alert(
        'Please fill in all required fields (Company ID/Name, Template Name, Status, Assigned User).'
      );
      return;
    }
    // Add validation for new company mode
    if (isNewCompany && (!companyId || !companyName)) {
      alert('Please provide both Company ID and Company Name when adding a new company.');
      return;
    }
    setIsLoading(true);

    // Prepare checklist data for the server action
    const checklistData = checklist.map((item) => ({
      checklistItemId: !item.isCustom ? item.id : undefined,
      customText: item.isCustom ? item.text : undefined,
      isChecked: item.isChecked,
    }));

    // Construct payload based on whether it's a new company or existing
    const designPayload = {
      id: isEditing ? (selectedDesignId ?? undefined) : undefined, // Ensure id is number | undefined
      companyId: Number(companyId), // Always send the ID (either selected or new)
      companyName: isNewCompany ? companyName : undefined, // Only send name if it's a new company
      isNewCompany: isNewCompany, // Flag to tell the action how to handle company
      templateName,
      partners: partners || null, // Send null if empty
      status,
      notes: notes || null, // Send null if empty, maps to 'designNotes' in server action
      userId: assignedUserId || null, // Send assigned user ID (or null if none selected)
      checklistItems: checklistData,
    };

    console.log('Submitting design data:', designPayload);

    try {
      await saveDesign(designPayload); // Use imported server action
      // Success message can be handled via toast/notification library if added
      // Redirect is handled within the server action
    } catch (error) {
      console.error('Error saving design:', error);
      alert(`Error saving design: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsLoading(false); // Keep form enabled on error
    }
    // No finally block needed for setIsLoading(false) here, as redirect happens on success
  };

  // --- Rendering ---
  return (
    <div className=''>
      {' '}
      {/* Use simple root div */}
      {/* Search Bar */}
      <div className='mb-4 relative'>
        {' '}
        {/* Reduced bottom margin */}
        <label htmlFor='search' className='block text-sm font-medium mb-1'>
          Search Existing Designs
        </label>
        <input
          type='text'
          id='search'
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder='Search by template name, company...'
          className='w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
          disabled={isLoading}
        />
        {searchResults.length > 0 && (
          <ul className='absolute z-10 w-full border rounded mt-1 max-h-60 overflow-y-auto bg-white dark:bg-gray-700 shadow-lg'>
            {searchResults.map((design) => (
              <li
                key={design.id}
                onClick={() => handleSelectSearchResult(design)}
                className='p-2 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer border-b dark:border-gray-600'
              >
                {design.templateName} ({design.company?.name || 'Unknown Company'})
              </li>
            ))}
          </ul>
        )}
      </div>
      {/* Use standard h1 styling, remove text-center and mb-6 */}
      <h1 className='text-2xl font-bold mb-4'>{isEditing ? 'Edit Design' : 'Create New Design'}</h1>
      <form onSubmit={handleSubmit} className='space-y-6'>
        {/* Company Input Mode Toggle */}
        <div className='flex items-center justify-end'>
          <label htmlFor='isNewCompanyToggle' className='text-sm mr-2'>
            Add New Company?
          </label>
          <input
            type='checkbox'
            id='isNewCompanyToggle'
            checked={isNewCompany}
            onChange={(e) => setIsNewCompany(e.target.checked)}
            className='form-checkbox h-4 w-4 text-blue-600 rounded focus:ring-blue-500'
            disabled={isLoading}
          />
        </div>

        {/* Conditional Company Inputs */}
        {isNewCompany ? (
          <>
            {/* New Company ID */}
            <div>
              <label htmlFor='newCompanyId' className='block text-sm font-medium mb-1'>
                New Company ID *
              </label>
              <input
                type='number'
                id='newCompanyId'
                value={companyId} // Use companyId state for the new ID input
                onChange={(e) => setCompanyId(e.target.value)}
                required
                placeholder='Enter unique numeric ID'
                className='w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                disabled={isLoading}
              />
            </div>
            {/* New Company Name */}
            <div>
              <label htmlFor='newCompanyName' className='block text-sm font-medium mb-1'>
                New Company Name *
              </label>
              <input
                type='text'
                id='newCompanyName'
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                placeholder='Enter company name'
                className='w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
                disabled={isLoading}
              />
            </div>
          </>
        ) : (
          /* Existing Company Selection */
          <div>
            <label htmlFor='company' className='block text-sm font-medium mb-1'>
              Select Existing Company *
            </label>
            <select
              id='company'
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              required={!isNewCompany} // Only required if not adding new
              className='w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
              disabled={isLoading}
            >
              <option value='' disabled>
                Select a company
              </option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name} ({company.id})
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Template Name */}
        <div>
          <label htmlFor='templateName' className='block text-sm font-medium mb-1'>
            Template Name *
          </label>
          <input
            type='text'
            id='templateName'
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            required
            className='w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
            disabled={isLoading}
          />
        </div>

        {/* Assign User Dropdown */}
        <div>
          <label htmlFor='assignedUserId' className='block text-sm font-medium mb-1'>
            Assign User *
          </label>
          <select
            id='assignedUserId'
            value={assignedUserId}
            onChange={(e) => setAssignedUserId(e.target.value)}
            required
            className='w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
            disabled={isLoading}
          >
            <option value='' disabled>
              Select a user to assign
            </option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || user.username} ({user.username})
              </option>
            ))}
          </select>
        </div>

        {/* Partners */}
        <div>
          <label htmlFor='partners' className='block text-sm font-medium mb-1'>
            Partners (Optional)
          </label>
          <input
            type='text'
            id='partners'
            value={partners}
            onChange={(e) => setPartners(e.target.value)}
            className='w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
            disabled={isLoading}
          />
        </div>

        {/* Status */}
        <div>
          <label htmlFor='status' className='block text-sm font-medium mb-1'>
            Status *
          </label>
          {/* TODO: Use Status enum from Prisma if available */}
          <select
            id='status'
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
            className='w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
            disabled={isLoading}
          >
            <option value='' disabled>
              Select status
            </option>
            <option value='NEW'>New</option>
            <option value='WAITING'>Waiting</option>
            <option value='NOT_SEND'>Not Send</option>
            <option value='SEND'>Send</option>
            <option value='DONE'>Done</option>
          </select>
        </div>

        {/* Checklist */}
        <div className='border p-4 rounded border-gray-300 dark:border-gray-600'>
          <h2 className='text-lg font-semibold mb-3'>Checklist</h2>
          <ul className='space-y-2 mb-4 max-h-60 overflow-y-auto'>
            {checklist.map((item, index) => (
              <li
                key={item.id ?? `custom-${item.designChecklistItemId ?? index}`}
                className='flex items-center justify-between p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded'
              >
                <label className='flex items-center space-x-3 cursor-pointer'>
                  <input
                    type='checkbox'
                    checked={item.isChecked}
                    onChange={() => handleChecklistChange(index)}
                    disabled={isLoading}
                    className='form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500'
                  />
                  <span className='text-sm'>{item.text}</span>
                </label>
                {item.isCustom && (
                  <button
                    type='button'
                    onClick={() => handleRemoveCustomChecklistItem(index)}
                    disabled={isLoading}
                    className='text-red-500 hover:text-red-700 text-xs font-medium px-2 py-1 rounded hover:bg-red-100 dark:hover:bg-red-900'
                    title='Remove custom item'
                  >
                    &times; {/* Use a simple 'x' or an icon */}
                  </button>
                )}
              </li>
            ))}
            {checklist.length === 0 && (
              <li className='text-sm text-gray-500'>No checklist items defined.</li>
            )}
          </ul>
          <div className='flex space-x-2 mt-4'>
            <input
              type='text'
              value={newCustomChecklistItem}
              onChange={(e) => setNewCustomChecklistItem(e.target.value)}
              placeholder='Add custom checklist item...'
              className='flex-grow p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
              disabled={isLoading}
            />
            <button
              type='button'
              onClick={handleAddCustomChecklistItem}
              disabled={isLoading || !newCustomChecklistItem.trim()}
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed'
            >
              Add Item
            </button>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor='notes' className='block text-sm font-medium mb-1'>
            Notes (Optional)
          </label>
          <textarea
            id='notes'
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            className='w-full p-2 border rounded bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
            disabled={isLoading}
            placeholder='Add any relevant notes for this design...'
          />
        </div>

        {/* Submit Button */}
        <button
          type='submit'
          disabled={
            isLoading ||
            !companyId ||
            (isNewCompany && !companyName) ||
            !templateName ||
            !status ||
            !assignedUserId
          }
          className='w-full px-4 py-3 bg-green-600 text-white rounded font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out'
        >
          {isLoading ? 'Saving...' : isEditing ? 'Update Design' : 'Create Design'}
        </button>
      </form>
    </div>
  );
};

export default NewDesignClientPage;
