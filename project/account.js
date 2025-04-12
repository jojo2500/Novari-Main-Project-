// account.js - Account page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Only run if on account page
    if (!document.getElementById('account-container')) return;

    // Navigation between sections
    document.querySelectorAll('.account-menu .nav-link, .quick-actions .btn[data-section]').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active state
            document.querySelectorAll('.account-menu .nav-link').forEach(el => {
                el.classList.remove('active');
            });
            
            // If clicked from quick actions, find and activate the corresponding nav link
            if (this.classList.contains('btn')) {
                const section = this.getAttribute('data-section');
                document.querySelector(`.account-menu .nav-link[data-section="${section}"]`).classList.add('active');
            } else {
                this.classList.add('active');
            }
            
            // Show the selected section
            const section = this.getAttribute('data-section');
            document.querySelectorAll('.account-section').forEach(el => {
                el.classList.add('d-none');
            });
            document.getElementById(`${section}-section`).classList.remove('d-none');
            
            // Update header title
            document.querySelector('.section-title').textContent = 
                this.textContent.trim().replace(/^\w/, c => c.toUpperCase());
        });
    });

    // Handle logout
    document.querySelector('.btn-logout').addEventListener('click', function() {
        // Show confirmation dialog
        if (confirm('Are you sure you want to logout?')) {
            // Clear all localStorage items
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('userRole');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('rememberMe');
            
            // Redirect to login page
            window.location.href = 'account.html';
        }
    });

    // Handle dashboard refresh
    const refreshButton = document.getElementById('refresh-dashboard');
    if (refreshButton) {
        refreshButton.addEventListener('click', async function() {
            // Disable button and show loading state
            this.disabled = true;
            const icon = this.querySelector('i');
            icon.classList.add('fa-spin');
            
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Update dashboard stats
                updateDashboardStats();
                
                // Show success message
                showToast('Dashboard refreshed successfully', 'success');
            } catch (error) {
                console.error('Error refreshing dashboard:', error);
                showToast('Failed to refresh dashboard', 'danger');
            } finally {
                // Reset button state
                this.disabled = false;
                icon.classList.remove('fa-spin');
            }
        });
    }

    // Handle avatar change
    const changeAvatarButton = document.getElementById('change-avatar');
    if (changeAvatarButton) {
        changeAvatarButton.addEventListener('click', function() {
            // Create file input
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            
            input.onchange = async function(e) {
                const file = e.target.files[0];
                if (file) {
                    try {
                        // Show loading state
                        changeAvatarButton.disabled = true;
                        changeAvatarButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
                        
                        // Simulate upload
                        await new Promise(resolve => setTimeout(resolve, 1500));
                        
                        // Update avatar (in a real app, this would use the uploaded image URL)
                        document.querySelector('.avatar-placeholder i').className = 'fas fa-user-circle';
                        document.querySelector('.avatar-placeholder i').style.fontSize = '4rem';
                        document.querySelector('.avatar-placeholder i').style.color = 'var(--primary-color)';
                        
                        showToast('Avatar updated successfully', 'success');
                    } catch (error) {
                        console.error('Error updating avatar:', error);
                        showToast('Failed to update avatar', 'danger');
                    } finally {
                        // Reset button state
                        changeAvatarButton.disabled = false;
                        changeAvatarButton.innerHTML = '<i class="fas fa-camera"></i>';
                    }
                }
            };
            
            input.click();
        });
    }

    // Update dashboard stats
    function updateDashboardStats() {
        // Simulate fetching stats
        const stats = {
            orders: Math.floor(Math.random() * 10),
            wishlist: Math.floor(Math.random() * 20)
        };

        document.querySelectorAll('.stat-card h3').forEach((el, index) => {
            el.textContent = index === 0 ? stats.orders : stats.wishlist;
        });
    }

    // Show toast notification
    function showToast(message, type = 'info') {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type} border-0 position-fixed top-0 end-0 m-3`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        
        // Create toast content
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        `;
        
        // Add toast to document
        document.body.appendChild(toast);
        
        // Initialize and show toast
        const bsToast = new bootstrap.Toast(toast, { autohide: true, delay: 3000 });
        bsToast.show();
        
        // Remove toast after it's hidden
        toast.addEventListener('hidden.bs.toast', function() {
            document.body.removeChild(toast);
        });
    }

    // Initialize dashboard
    updateDashboardStats();
});