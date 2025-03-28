import React, { useState, useCallback, useEffect } from 'react';
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
import { PERMISSIONS2, ROOT_URL } from '../../../../const';
import axios from 'axios';

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
  const [policyProps, setPolicyProps] = useState([]);

  // Toggle individual permission
  const togglePermission = useCallback((permission) => {
    setPermissions(prev => ({
      ...prev,
      [permission.permission]: !prev[permission.permission],
      [`permission_id_${permission.permission}`]: permission.id
    }));
  }, []);

  // Toggle policy expansion
  const togglePolicyExpansion = (policyId) => {
    setExpandedPolicies(prev => ({
      ...prev,
      [policyId]: !prev[policyId]
    }));
  };

  // Toggle all permissions for a specific policy
  const togglePolicyPermissions = (policy, checked) => {
    const policyPermissions = policy.permissions.reduce((acc, perm) => {
      acc[perm.permission] = checked;
      if (checked) {
        acc[`permission_id_${perm.permission}`] = perm.id;
      }
      return acc;
    }, {});

    setPermissions(prev => ({
      ...prev,
      ...policyPermissions
    }));
  };

  // Check if all permissions in a policy are enabled
  const isPolicyEnabled = (policy) => {
    return policy.permissions.every(perm => permissions[perm.permission]);
  };

  const handlefetchPermissions = async () => {
    let response = await axios.get(`${ROOT_URL}api/getPolicyProps`);
    if(response.status === 200){
      setPolicyProps(response.data.data);
    }
  }

  const handleSubmit =async (e) => {
    
    e.preventDefault();
    
    // Filter enabled permissions and map to their IDs
    const enabledPermissionIds = Object.entries(permissions)
      .filter(([key, value]) => !key.startsWith('permission_id_') && value === true)
      .map(([key]) => permissions[`permission_id_${key}`]);
    
    const roleData = {
      name: roleName,
      branch: selectedBranch?.id || null,
      permissions: enabledPermissionIds
    };

    console.log(roleData,'this is role data');

  let response= await axios.post(`${ROOT_URL}api/getRoleProps`, roleData);

      if(response.status === 200){
        alert('Role created successfully');
      }else{
        alert('Role creation failed');
      }
    
  };

  useEffect(()=>{
    handlefetchPermissions();
  },[])

  console.log(policyProps,'this is policy props');
  

  return (
    <div className="flex items-center justify-center overflow-y-scroll mb-14">
      <div className="w-full overflow-y-scroll">
        <div className="bg-gradient-to-r px-8">
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
              className="w-1/3 px-4 py-2 border border-gray-300 rounded-md outline-none"
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
                  <span className="text-gray-500 ml-2 text-sm">({selectedBranch.location})</span>
                </div> : 
                <span className="text-gray-400 bg-gray-50">Select a branch</span>
              }
              {branchDropdownOpen ? <ChevronUp /> : <ChevronDown />}
            </div>
            {branchDropdownOpen && (
              <div className="absolute z-10 w-1/3 bg-white border border-gray-300 rounded-md mt-1 shadow-lg">
                {BRANCHES.map(branch => (
                  <div 
                    key={branch.id}
                    onClick={() => {
                      setSelectedBranch(branch);
                      setBranchDropdownOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center border-b-[1px]"
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

            {policyProps?.map((policy) => (
              <div 
                key={policy.id} 
                className="border border-gray-200 bg-white rounded-md overflow-hidden"
              >
                <div 
                  onClick={() => togglePolicyExpansion(policy.id)}
                  className="bg-blue-700 text-white px-4 py-2 flex justify-between items-center cursor-pointer transition-all"
                >
                  <div className="flex items-center space-x-3">
                    <span className="font-semibold capitalize text-sm">
                      {policy.description.replace('_', ' ')} Permissions
                    </span>
                    <div 
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePolicyPermissions(policy, !isPolicyEnabled(policy));
                      }}
                      className={`w-12 h-6 rounded-full transition-all relative ${
                        isPolicyEnabled(policy) 
                          ? 'bg-blue-500' 
                          : 'bg-gray-300'
                      }`}
                    >
                      <div 
                        className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full transition-all ${
                          isPolicyEnabled(policy) 
                            ? 'right-1' 
                            : 'left-1'
                        }`} 
                      />
                    </div>
                  </div>
                  {expandedPolicies[policy.id] ? <ChevronUp /> : <ChevronDown />}
                </div>

                {true && (
                  <div className="p-4 space-y-3">
                    {policy.permissions.map((permission) => (
                      <div 
                        key={permission.id} 
                        className="flex justify-between items-center p-2 rounded-lg transition-all"
                      >
                        <div>
                          <div className="font-medium">{permission.description}</div>
                          <div className="text-sm text-gray-500">
                            {permission.action.charAt(0).toUpperCase() + permission.action.slice(1)} permission
                          </div>
                        </div>
                        <div 
                          onClick={() => togglePermission(permission)}
                          className={`w-12 h-6 rounded-full transition-all relative cursor-pointer ${
                            permissions[permission.permission] 
                              ? 'bg-blue-500' 
                              : 'bg-gray-300'
                          }`}
                        >
                          <div 
                            className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full transition-all ${
                              permissions[permission.permission] 
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