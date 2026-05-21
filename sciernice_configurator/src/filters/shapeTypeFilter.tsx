import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Tooltip from '@mui/material/Tooltip';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { ABRASIVE_FILTER_GROUPS, type FilterGroup, type Subtype } from '../utils/filterGroups';
import { wheelTypesData } from '../utils/abrasivesConsts';

interface ShapeTypeFilterProps {
  selectedTypes: string[];
  onTypesChange: (types: string[]) => void;
  facetCounts: Record<string, number>; 
}

export default function ShapeTypeFilter({
  selectedTypes,
  onTypesChange,
  facetCounts
}: ShapeTypeFilterProps) {

  const getSubtypeCount = (subtype: Subtype) => {
    return subtype.values.reduce((sum, val) => sum + (facetCounts[val] || 0), 0);
  };

  const getGroupCount = (group: FilterGroup) => {
    return group.subtypes.reduce((sum, sub) => sum + getSubtypeCount(sub), 0);
  };

  const isSubtypeChecked = (subtype: Subtype) => {
    return subtype.values.every(val => selectedTypes.includes(val));
  };

  const isSubtypeIndeterminate = (subtype: Subtype) => {
    const hasSome = subtype.values.some(val => selectedTypes.includes(val));
    const hasAll = subtype.values.every(val => selectedTypes.includes(val));
    return hasSome && !hasAll;
  };

  const handleSubtypeToggle = (subtype: Subtype) => {
    const isChecked = isSubtypeChecked(subtype);
    let newSelected: string[];

    if (isChecked) {
      newSelected = selectedTypes.filter(val => !subtype.values.includes(val));
    } else {
      const missingValues = subtype.values.filter(val => !selectedTypes.includes(val));
      newSelected = [...selectedTypes, ...missingValues];
    }
    
    onTypesChange(newSelected);
  };

  const getSubtypeTooltipText = (subtype: Subtype): string => {
    return subtype.values
      .map(val => {
        const info = wheelTypesData[val];
        return info ? `${info.name}: ${info.desc}` : `Typ ${val}`;
      })
      .join('\n\n');
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="body2" fontWeight={600} color="text.secondary" sx={{ mb: 1.5, px: 0.5 }}>
        TYP / KSZTAŁT ŚCIERNICY
      </Typography>

      {ABRASIVE_FILTER_GROUPS.map((group) => {
        const totalGroupCount = getGroupCount(group);
        
        if (totalGroupCount === 0) return null; 

        return (
          <Accordion 
            key={group.id} 
            disableGutters 
            elevation={0} 
            sx={{ 
              border: 'none',
              '&:before': { display: 'none' }, 
              bgcolor: 'transparent'
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon fontSize="small" />}
              sx={{ 
                px: 0.5, 
                minHeight: 40, 
                '& .MuiAccordionSummary-content': { my: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' } 
              }}
            >
              <Typography variant="body2" fontWeight={500}>
                {group.label}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mr: 1 }}>
                ({totalGroupCount})
              </Typography>
            </AccordionSummary>

            <AccordionDetails sx={{ p: 0, pl: 1, pb: 1 }}>
              {group.subtypes.map((subtype, index) => {
                const count = getSubtypeCount(subtype);
                
                if (count === 0 && !isSubtypeChecked(subtype)) return null; 

                const tooltipContent = getSubtypeTooltipText(subtype);

                return (
                  <Box 
                    key={index} 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      width: '100%',
                      justifyContent: 'space-between',
                      pr: 1
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          checked={isSubtypeChecked(subtype)}
                          indeterminate={isSubtypeIndeterminate(subtype)}
                          onChange={() => handleSubtypeToggle(subtype)}
                        />
                      }
                      label={
                        <Typography variant="body2" color="text.primary">
                          {subtype.label} <span style={{ color: '#888', fontSize: '0.75rem' }}>({count})</span>
                        </Typography>
                      }
                      sx={{ my: -0.25, flexGrow: 1 }}
                    />
                    
                    <Tooltip 
                      title={
                        <div style={{ whiteSpace: 'pre-line', padding: '4px' }}>
                          {tooltipContent}
                        </div>
                      }
                      arrow
                      placement="left"
                    >
                      <HelpOutlineIcon 
                        sx={{ 
                          fontSize: 16, 
                          color: 'action.disabled', 
                          cursor: 'help',
                          '&:hover': { color: 'action.active' }
                        }} 
                      />
                    </Tooltip>
                  </Box>
                );
              })}
            </AccordionDetails>
          </Accordion>
        );
      })}
    </Box>
  );
}