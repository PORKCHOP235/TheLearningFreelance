const form = document.querySelector('#inquiry');
const status = document.querySelector('#form-status');
const submit = form.querySelector('button[type="submit"]');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const endpoint = form.dataset.endpoint;
  if (!endpoint) {
    status.textContent = 'This preview cannot send requests yet. Your details have not been sent.';
    return;
  }

  submit.disabled = true;
  status.textContent = 'Sending your request…';
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: new FormData(form),
    });
    if (!response.ok) throw new Error('Submission failed');
    form.reset();
    status.textContent = 'Thanks for telling me about your business. I’ll email you to coordinate a discovery call.';
  } catch {
    status.textContent = 'Your request could not be sent. Please try again.';
  } finally {
    submit.disabled = false;
  }
});
