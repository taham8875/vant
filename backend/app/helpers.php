<?php

if (! function_exists('default_notification_preferences')) {
    /**
     * Get the default notification preferences structure.
     *
     * @return array<string, bool>
     */
    function default_notification_preferences(): array
    {
        return [
            'budget_alerts' => true,
            'email_alerts' => true,
            'push_alerts' => false,
        ];
    }
}
