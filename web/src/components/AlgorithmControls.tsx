import React from 'react';
import { Settings } from 'lucide-react';

interface AlgorithmControlsProps {
  type: 'sorting' | 'searching' | 'graph' | 'tree';
  config: any;
  onConfigChange: (config: any) => void;
}

export const AlgorithmControls: React.FC<AlgorithmControlsProps> = ({
  type,
  config,
  onConfigChange,
}) => {
  const handleChange = (key: string, value: any) => {
    onConfigChange({ ...config, [key]: value });
  };

  return (
    <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-black rounded-xl shadow-lg p-6 mb-6 border border-gray-700">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-purple-500" />
        <h3 className="text-lg font-semibold text-white">Algorithm Settings</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {type === 'sorting' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Array Size
              </label>
              <input
                type="range"
                min="5"
                max="20"
                value={config.arraySize || 10}
                onChange={(e) => handleChange('arraySize', parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-500">{config.arraySize || 10} elements</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Animation Speed
              </label>
              <input
                type="range"
                min="100"
                max="2000"
                step="100"
                value={config.delay || 1000}
                onChange={(e) => handleChange('delay', parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-500">{config.delay || 1000}ms</span>
            </div>
          </>
        )}

        {type === 'graph' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Number of Nodes
              </label>
              <input
                type="range"
                min="4"
                max="10"
                value={config.graphNodes || 6}
                onChange={(e) => handleChange('graphNodes', parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-500">{config.graphNodes || 6} nodes</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Graph Type
              </label>
              <div className="space-y-2">
                <label className="flex items-center text-gray-300">
                  <input
                    type="checkbox"
                    checked={config.weighted}
                    onChange={(e) => handleChange('weighted', e.target.checked)}
                    className="mr-2 accent-purple-500"
                  />
                  <span className="text-sm">Weighted</span>
                </label>
                <label className="flex items-center text-gray-300">
                  <input
                    type="checkbox"
                    checked={config.directed}
                    onChange={(e) => handleChange('directed', e.target.checked)}
                    className="mr-2 accent-purple-500"
                  />
                  <span className="text-sm">Directed</span>
                </label>
              </div>
            </div>
          </>
        )}

        {type === 'tree' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Tree Size
              </label>
              <input
                type="range"
                min="3"
                max="15"
                value={config.treeNodes || 7}
                onChange={(e) => handleChange('treeNodes', parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-500">{config.treeNodes || 7} nodes</span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Traversal Type
              </label>
              <select
                value={config.traversalType || 'inorder'}
                onChange={(e) => handleChange('traversalType', e.target.value)}
                className="mt-1 block w-full rounded-md bg-gray-800 text-gray-300 border-gray-700 shadow-sm focus:border-purple-500 focus:ring focus:ring-purple-500 focus:ring-opacity-50"
              >
                <option value="inorder">Inorder</option>
                <option value="preorder">Preorder</option>
                <option value="postorder">Postorder</option>
                <option value="levelorder">Level Order</option>
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
