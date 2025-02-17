import React, { useState, useCallback } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Check, 
  X, 
  Building2, 
  User, 
  Shield, 
  Tag 
} from 'lucide-react';

const PERMISSIONS = {
  dashboard: [
    { key: 'view_dashboard', label: 'View Dashboard', description: 'Access main dashboard overview' }
  ],
  leads: [
    { key: 'view_leads', label: 'View Leads', description: 'Can view lead list' },
    { key: 'create_lead', label: 'Create Lead', description: 'Ability to add new leads' },
    { key: 'update_lead', label: 'Update Lead', description: 'Modify existing lead information' },
    { key: 'delete_lead', label: 'Delete Lead', description: 'Remove leads from system' }
  ],
  leads_details: [
    { key: 'view_leads_details_personal_details', label: 'View  Personal Details', description: 'Can view  list' },
    { key: 'update_leads_details_personal_details', label: 'Update  Personal Details', description: 'Modify existing  information' },
    { key: 'view_leads_details_collborators', label: 'View Lead Colaborators', description: 'Modify existing  information' },
    { key: 'update_leads_details_collborators', label: 'Update Lead  Colaborators', description: 'Modify existing  information' },
    { key: 'view_leads_details_headcollborator', label: 'view  Head Colaborator', description: 'Modify existing  information' },
    { key: 'update_leads_details_headcollborator', label: 'Update  Head Colaborator', description: 'Modify existing  information' }
    
  ],
  users: [
    { key: 'view_users', label: 'View Users', description: 'Access user management' },
    { key: 'create_user', label: 'Create User', description: 'Add new system users' },
    { key: 'update_user', label: 'Update User', description: 'Modify user details' }
  ],
  business_settings: [
    { key: 'view_business_settings', label: 'View Business Settings', description: 'Access business configuration' },
    { key: 'update_business_settings', label: 'Update Business Settings', description: 'Modify business configuration' },
    { key: 'view_roles_permissions', label: 'View Roles', description: 'Can see role definitions' }
  ]
};

const BRANCHES = [
  { id: '1', name: 'Main Office', location: 'Headquarters' },
  { id: '2', name: 'Downtown Branch', location: 'City Center' },
  { id: '3', name: 'West Branch', location: 'West District' }
];

const RolePermissionsForm = () => {
  const [roleName, setRoleName] = useState('');
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [expandedPolicies, setExpandedPolicies] = useState({});
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);

  // Toggle individual permission
  const togglePermission = useCallback((permissionKey) => {
    setPermissions(prev => ({
      ...prev,
      [permissionKey]: !prev[permissionKey]
    }));
  }, []);

  // Toggle policy expansion
  const togglePolicyExpansion = (policy) => {
    setExpandedPolicies(prev => ({
      ...prev,
      [policy]: !prev[policy]
    }));
  };

  // Toggle all permissions for a specific policy
  const togglePolicyPermissions = (policy, checked) => {
    const policyPermissions = PERMISSIONS[policy].reduce((acc, perm) => {
      acc[perm.key] = checked;
      return acc;
    }, {});

    setPermissions(prev => ({
      ...prev,
      ...policyPermissions
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const roleData = {
      name: roleName,
      branch: selectedBranch,
      permissions: Object.keys(permissions).filter(key => permissions[key])
    };
    console.log('Role Data:', roleData);
  };

  return (
    <div className=" flex items-center justify-center overflow-y-scroll mb-14">
      <div className="w-full  overflow-y-scroll">
        <div className="bg-gradient-to-r px-8 ">
          <h1 className="text-xl font-bold text-black flex items-center">
            Create New Role
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="px-8 py-5 space-y-6">
          {/* Role Name Input */}
          <div className="space-y-2">
            <label className="block font-semibold text-sm font-medium text-gray-700 flex items-center">
             
              Role Name
            </label>
            <input 
              type="text"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Enter role name"
              className="w-1/3 px-4 py-2 border border-gray-300 rounded-md outline-none "
              required
            />
          </div>

          {/* Branch Selection */}
          <div className="space-y-2 relative">
            <label className="block font-semibold text-sm font-medium text-gray-700 flex items-center">
              Branch
            </label>
            <div 
              onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
              className="w-1/3 px-4 py-2 border border-gray-300 rounded-md flex items-center justify-between cursor-pointer bg-white transition-all"
            >
              {selectedBranch ? 
                <div className="flex items-center">
                  <span className="font-medium">{selectedBranch.name}</span>
                  <span className="text-gray-500 ml-2 text-sm  ">({selectedBranch.location})</span>
                </div> : 
                <span className="text-gray-400 bg-gray-50">Select a branch</span>
              }
              {branchDropdownOpen ? <ChevronUp /> : <ChevronDown />}
            </div>
            {branchDropdownOpen && (
              <div className="absolute  z-10 w-1/3 bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
                {BRANCHES.map(branch => (
                  <div 
                    key={branch.id}
                    onClick={() => {
                      setSelectedBranch(branch);
                      setBranchDropdownOpen(false);
                    }}
                    className="px-4 py-2  hover:bg-gray-100 cursor-pointer flex justify-between items-center border-b-[1px]"
                  >
                    <div>
                      <span className="font-medium">{branch.name}</span>
                      <span className="text-gray-500 ml-2 text-sm">({branch.location})</span>
                    </div>
                    {selectedBranch?.id === branch.id && <Check className="text-green-500" />}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Permissions Sections */}
          <div className="space-y-6">
            <h2 className="text-sm font-semibold text-gray-800 flex items-center">
              Permissions
            </h2>

            {Object.entries(PERMISSIONS).map(([policy, policyPermissions]) => (
              <div 
                key={policy} 
                className="border border-gray-200 bg-white rounded-md overflow-hidden"
              >
                <div 
                  onClick={() => togglePolicyExpansion(policy)}
                  className="bg-blue-700 text-white px-4 py-2 flex justify-between items-center cursor-pointer  transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold capitalize text-sm">
                      {policy.replace('_', ' ')} Permissions
                    </span>
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        const allChecked = policyPermissions.every(perm => permissions[perm.key]);
                        togglePolicyPermissions(policy, !allChecked);
                      }}
                      className={`w-12 h-6 rounded-full transition-all relative ${
                        policyPermissions.every(perm => permissions[perm.key]) 
                          ? 'bg-blue-500' 
                          : 'bg-gray-300'
                      }`}
                    >
                      <div 
                        className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full transition-all ${
                          policyPermissions.every(perm => permissions[perm.key]) 
                            ? 'right-1' 
                            : 'left-1'
                        }`} 
                      />
                    </div>
                  </div>
                  
                </div>

                {true && (
                  <div className="p-4 space-y-3">
                    {policyPermissions.map((permission) => (
                      <div 
                        key={permission.key} 
                        className="flex justify-between items-center  p-2 rounded-lg transition-all"
                      >
                        <div>
                          <div className="font-medium">{permission.label}</div>
                          <div className="text-sm text-gray-500">
                            {permission.description}
                          </div>
                        </div>
                        <div 
                          onClick={() => togglePermission(permission.key)}
                          className={`w-12 h-6 rounded-full transition-all relative cursor-pointer ${
                            permissions[permission.key] 
                              ? 'bg-blue-500' 
                              : 'bg-gray-300'
                          }`}
                        >
                          <div 
                            className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full transition-all ${
                              permissions[permission.key] 
                                ? 'right-1' 
                                : 'left-1'
                            }`} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            
            <button 
              type="submit"
              className="px-6 py-2 font-semibold bg-gradient-to-r bg-blue-700 text-white rounded-lg hover:opacity-90 transition-all flex items-center"
            >
              <Check className="mr-2" /> Create Role
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RolePermissionsForm;