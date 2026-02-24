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
    if (response.status === 200) {
      setPolicyProps(response.data.data);
    }
  }

  const handleSubmit = async (e) => {

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

    console.log(roleData, 'this is role data');

    let response = await axios.post(`${ROOT_URL}api/getRoleProps`, roleData);

    if (response.status === 200) {
      alert('Role created successfully');
    } else {
      alert('Role creation failed');
    }

  };

  useEffect(() => {
    handlefetchPermissions();
  }, [])




  return (
    <div className="mx-auto animate-in fade-in duration-500 overflow-y-auto pb-20">
      <div className="w-full">
        <div className="flex items-center gap-4 mb-8">
          <div className="bg-[#0F1626] p-3 rounded-2xl shadow-xl">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-[#0F1626] tracking-tight">Access Control</h1>
            <p className="text-sm font-medium text-gray-400 mt-0.5 uppercase tracking-widest text-[10px]">Define roles and security permissions for your team</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Info Card */}
          <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Role Name Input */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">
                Role Authority Name
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-500 transition-colors">
                  <Tag size={18} />
                </div>
                <input
                  type="text"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  placeholder="e.g. Regional Sales Lead"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-transparent focus:border-indigo-500 focus:bg-white rounded-xl outline-none transition-all font-medium"
                  required
                />
              </div>
            </div>

            {/* Branch Selection */}
            <div className="space-y-2 relative">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">
                Security Branch Scope
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-indigo-500 transition-colors z-[1]">
                  <Building2 size={18} />
                </div>
                <div
                  onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border border-transparent hover:border-indigo-200 focus:border-indigo-500 rounded-xl flex items-center justify-between cursor-pointer transition-all font-medium"
                >
                  {selectedBranch ?
                    <div className="flex items-center">
                      <span className="font-bold text-[#0F1626]">{selectedBranch.name}</span>
                      <span className="text-gray-400 ml-2 text-xs">({selectedBranch.location})</span>
                    </div> :
                    <span className="text-gray-400">Select business branch</span>
                  }
                  {branchDropdownOpen ? <ChevronUp size={18} className="text-indigo-500" /> : <ChevronDown size={18} className="text-gray-400" />}
                </div>
              </div>

              {branchDropdownOpen && (
                <div className="absolute z-20 w-full bg-white border border-gray-100 rounded-2xl mt-2 shadow-2xl p-2 animate-in zoom-in-95 duration-200">
                  {BRANCHES.map(branch => (
                    <div
                      key={branch.id}
                      onClick={() => {
                        setSelectedBranch(branch);
                        setBranchDropdownOpen(false);
                      }}
                      className="px-4 py-3 hover:bg-indigo-50/50 rounded-xl cursor-pointer flex justify-between items-center transition-colors group"
                    >
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-gray-700 group-hover:text-indigo-600 transition-colors">{branch.name}</span>
                        <span className="text-gray-400 text-[10px] uppercase font-bold tracking-widest">{branch.location}</span>
                      </div>
                      {selectedBranch?.id === branch.id && (
                        <div className="bg-indigo-600 p-1 rounded-full">
                          <Check className="text-white" size={12} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Permissions Sections */}
          <div className="space-y-6">
            <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">
              Functional Permissions Context
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {policyProps?.map((policy) => (
                <div
                  key={policy.id}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
                >
                  <div
                    className="bg-[#0F1626] text-white px-6 py-4 flex justify-between items-center"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-1.5 bg-gray-800 rounded-lg">
                        <Shield size={14} className="text-indigo-400" />
                      </div>
                      <span className="font-bold capitalize text-xs tracking-widest uppercase">
                        {policy.description.replace('_', ' ')}
                      </span>
                    </div>

                    <div
                      onClick={() => togglePolicyPermissions(policy, !isPolicyEnabled(policy))}
                      className={`w-12 h-6 rounded-full transition-all relative cursor-pointer ${isPolicyEnabled(policy)
                          ? 'bg-indigo-500 shadow-[0_0_15px_-3px_rgba(99,102,241,0.5)]'
                          : 'bg-gray-700'
                        }`}
                    >
                      <div
                        className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg transition-all ${isPolicyEnabled(policy)
                            ? 'right-1'
                            : 'left-1'
                          }`}
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50/30 border-b border-gray-100">
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest px-3">Available Operations</p>
                  </div>

                  <div className="p-4 space-y-2">
                    {policy.permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                      >
                        <div className="flex-1 min-w-0 pr-4">
                          <div className="font-bold text-sm text-gray-700">{permission.description}</div>
                          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter mt-0.5">
                            {permission.action} level clearance
                          </div>
                        </div>
                        <div
                          onClick={() => togglePermission(permission)}
                          className={`w-10 h-5 rounded-full transition-all relative cursor-pointer flex-shrink-0 ${permissions[permission.permission]
                              ? 'bg-indigo-500 shadow-[0_0_10px_-2px_rgba(99,102,241,0.4)]'
                              : 'bg-gray-200'
                            }`}
                        >
                          <div
                            className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${permissions[permission.permission]
                                ? 'right-1 text-indigo-600'
                                : 'left-1 text-gray-400'
                              }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-8">
            <button
              type="submit"
              className="px-10 py-4 font-bold bg-indigo-600 text-white rounded-xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center uppercase tracking-widest text-xs"
            >
              <Check className="mr-3" size={18} /> Finalize Role Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RolePermissionsForm;