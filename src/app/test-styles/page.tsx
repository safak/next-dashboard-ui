import React from 'react';

const TestStylesPage = () => {
  return (
    <div className='p-8 space-y-4 bg-background text-foreground'>
      <h1 className='text-2xl font-bold'>Style Examples</h1>

      <section>
        <h2 className='text-xl font-semibold mb-2'>Basic Colors</h2>
        <p>This text uses the default foreground color on the default background.</p>
        <p className='text-primary'>This text uses the primary color.</p>
        <p className='text-secondary'>This text uses the secondary color.</p>
        <p className='text-muted-foreground'>This text uses the muted foreground color.</p>
        <p className='text-accent'>This text uses the accent color.</p>
        <p className='text-destructive'>This text uses the destructive color.</p>
        <p className='text-success-foreground bg-success p-1 rounded-sm inline-block'>
          Success text on success background.
        </p>
        <p className='text-warning-foreground bg-warning p-1 rounded-sm inline-block'>
          Warning text on warning background.
        </p>
        <p className='text-info-foreground bg-info p-1 rounded-sm inline-block'>
          Info text on info background.
        </p>
      </section>

      <section>
        <h2 className='text-xl font-semibold mb-2'>Card Example</h2>
        <div className='bg-card text-card-foreground p-4 rounded-lg shadow-md'>
          This is a card component using card background and foreground colors, padding, and large
          border radius.
        </div>
      </section>

      <section>
        <h2 className='text-xl font-semibold mb-2'>Input Example</h2>
        <input
          type='text'
          placeholder='Example Input'
          className='border border-input rounded-md p-2 w-full focus:ring-2 focus:ring-ring focus:outline-none'
        />
        <p className='text-sm text-muted-foreground mt-1'>
          Uses input border, medium radius, and focus ring.
        </p>
      </section>

      <section>
        <h2 className='text-xl font-semibold mb-2'>Button Example</h2>
        <button className='bg-primary text-primary-foreground hover:bg-primary-hover px-4 py-2 rounded-md'>
          Primary Button
        </button>
        <p className='text-sm text-muted-foreground mt-1'>
          Uses primary colors, hover state, padding, and medium radius.
        </p>
      </section>

      <section>
        <h2 className='text-xl font-semibold mb-2'>Popover Example (Visual Only)</h2>
        <div className='bg-popover text-popover-foreground p-4 rounded-lg shadow-lg border border-border w-fit'>
          This simulates a popover appearance.
        </div>
      </section>

      <section>
        <h2 className='text-xl font-semibold mb-2'>Border Examples</h2>
        <div className='border p-2 rounded-sm'>Default border</div>
        <div className='border-2 border-border-subtle p-2 mt-2 rounded-md'>
          Subtle border (thicker for visibility)
        </div>
      </section>

      <section>
        <h2 className='text-xl font-semibold mb-2'>Background Examples</h2>
        <div className='bg-background-subtle p-2 rounded-sm'>Subtle background</div>
      </section>

      <section>
        <h2 className='text-xl font-semibold mb-2'>Radius Examples</h2>
        <div className='bg-muted p-2 rounded-sm w-fit mb-1'>Small Radius</div>
        <div className='bg-muted p-2 rounded-md w-fit mb-1'>Medium Radius</div>
        <div className='bg-muted p-2 rounded-lg w-fit'>Large Radius</div>
      </section>
    </div>
  );
};

export default TestStylesPage;
